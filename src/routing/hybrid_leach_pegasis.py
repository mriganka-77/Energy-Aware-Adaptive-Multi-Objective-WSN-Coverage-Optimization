"""
Hybrid LEACH–PEGASIS Routing Protocol Module.
Combines dynamic energy-aware clustering (LEACH) with intra-cluster nearest-neighbor
chaining (PEGASIS), data compression aggregation (0.8 factor), and multi-hop CH routing.
"""

from typing import List, Dict, Tuple, Optional, Union
import numpy as np

from src.routing.radio_energy_model import RadioEnergyModel
from src.models.sensor import SensorNode
from src.models.network import WSNNetwork


class HybridLEACHPEGASISSimulator:
    """Simulates the Hybrid LEACH–PEGASIS hierarchical routing protocol."""
    
    def __init__(
        self,
        radio_model: Optional[RadioEnergyModel] = None,
        ch_percentage: float = 0.05,
        multihop_threshold: float = 75.0,
        aggregation_factor: float = 0.8
    ):
        self.radio = radio_model or RadioEnergyModel()
        self.ch_percentage = float(ch_percentage)
        self.multihop_threshold = float(multihop_threshold)
        self.aggregation_factor = float(aggregation_factor)
        
    def run_simulation(
        self,
        nodes: Union[List[SensorNode], WSNNetwork, List[Dict[str, float]], np.ndarray],
        max_rounds: int = 1000
    ) -> Tuple[List[int], List[float], int, int, int]:
        """
        Executes Hybrid LEACH–PEGASIS communication rounds.
        
        Returns:
            (alive_per_round, energy_per_round, fnd, hnd, lnd)
        """
        if isinstance(nodes, WSNNetwork):
            node_list = [{"x": n.x, "y": n.y, "E": n.residual_energy} for n in nodes.nodes]
        elif isinstance(nodes, list):
            node_list = []
            for n in nodes:
                if isinstance(n, SensorNode):
                    node_list.append({"x": n.x, "y": n.y, "E": n.residual_energy})
                elif isinstance(n, dict):
                    node_list.append({"x": float(n["x"]), "y": float(n["y"]), "E": float(n["E"])})
                else:
                    node_list.append({"x": float(n[0]), "y": float(n[1]), "E": 0.5})
        else:
            coords = np.asarray(nodes)
            node_list = [{"x": float(c[0]), "y": float(c[1]), "E": 0.5} for c in coords]
            
        num_nodes = len(node_list)
        alive_history = []
        energy_history = []
        
        fnd = -1
        hnd = -1
        lnd = -1
        
        k = self.radio.packet_size
        do = self.radio.d0
        sink_x, sink_y = self.radio.sink_x, self.radio.sink_y
        
        for r in range(max_rounds):
            # 1. Rotational Selection of Top Energy Cluster Heads
            energies = [node["E"] for node in node_list]
            sorted_nodes = np.argsort(energies)[::-1] # Descending order of residual energy
            
            num_ch = max(1, int(self.ch_percentage * num_nodes))
            # Shift CH window per round to rotate leadership
            start_idx = (r * num_ch) % num_nodes
            ch_candidates = sorted_nodes[start_idx : start_idx + num_ch].tolist()
            if len(ch_candidates) < num_ch:
                ch_candidates += sorted_nodes[0 : num_ch - len(ch_candidates)].tolist()
                
            ch_list = [ch_idx for ch_idx in ch_candidates if node_list[ch_idx]["E"] > 0]
            
            # 2. Form Clusters (assign alive non-CH nodes to closest CH)
            clusters = {ch: [] for ch in ch_list}
            for i, node in enumerate(node_list):
                if node["E"] > 0 and i not in ch_list:
                    if ch_list:
                        distances = [np.sqrt((node["x"] - node_list[c]["x"])**2 + (node["y"] - node_list[c]["y"])**2) for c in ch_list]
                        nearest_ch = ch_list[int(np.argmin(distances))]
                        clusters[nearest_ch].append(i)
                        
            # 3. Intra-Cluster PEGASIS Chain Formation & Data Aggregation
            for ch, members in clusters.items():
                if node_list[ch]["E"] <= 0:
                    continue
                    
                if members:
                    # Construct greedy chain inside the cluster
                    chain = members.copy()
                    ordered = [chain.pop(0)]
                    while chain:
                        last = ordered[-1]
                        dist_to_chain = [
                            np.sqrt((node_list[last]["x"] - node_list[m]["x"])**2 + (node_list[last]["y"] - node_list[m]["y"])**2)
                            for m in chain
                        ]
                        nearest_m_idx = int(np.argmin(dist_to_chain))
                        ordered.append(chain.pop(nearest_m_idx))
                        
                    local_k = k
                    # Transmit along the intra-cluster chain
                    for i_chain in range(len(ordered) - 1):
                        a, b = ordered[i_chain], ordered[i_chain + 1]
                        if node_list[a]["E"] > 0:
                            node_list[a]["E"] -= self.radio.idle_energy_drain
                            d = np.sqrt((node_list[a]["x"] - node_list[b]["x"])**2 + (node_list[a]["y"] - node_list[b]["y"])**2)
                            node_list[a]["E"] -= self.radio.transmission_energy(d, int(local_k))
                            
                            if node_list[b]["E"] > 0:
                                node_list[b]["E"] -= (self.radio.reception_energy(int(local_k)) + self.radio.aggregation_energy(int(local_k)))
                                
                            local_k *= self.aggregation_factor
                            
                    # End of chain delivers data to the Cluster Head
                    last_node = ordered[-1]
                    if node_list[last_node]["E"] > 0:
                        node_list[last_node]["E"] -= self.radio.idle_energy_drain
                        d = np.sqrt((node_list[last_node]["x"] - node_list[ch]["x"])**2 + (node_list[last_node]["y"] - node_list[ch]["y"])**2)
                        node_list[last_node]["E"] -= self.radio.transmission_energy(d, int(local_k))
                        
                        if node_list[ch]["E"] > 0:
                            node_list[ch]["E"] -= (self.radio.reception_energy(int(local_k)) + self.radio.aggregation_energy(int(local_k)))
                            
            # 4. Cluster Heads to Base Station (Multi-Hop CH or Direct)
            for ch_idx in ch_list:
                if node_list[ch_idx]["E"] > 0:
                    node_list[ch_idx]["E"] -= self.radio.idle_energy_drain
                    transmit_to_bs = True
                    
                    # Inter-CH multi-hop if another alive CH is within threshold
                    other_chs = [c for c in ch_list if c != ch_idx and node_list[c]["E"] > 0]
                    if other_chs:
                        dist_to_other_chs = [
                            np.sqrt((node_list[ch_idx]["x"] - node_list[c]["x"])**2 + (node_list[ch_idx]["y"] - node_list[c]["y"])**2)
                            for c in other_chs
                        ]
                        min_ch_dist = min(dist_to_other_chs)
                        nearest_other_ch = other_chs[int(np.argmin(dist_to_other_chs))]
                        
                        if min_ch_dist < self.multihop_threshold:
                            node_list[ch_idx]["E"] -= self.radio.transmission_energy(min_ch_dist, k)
                            if node_list[nearest_other_ch]["E"] > 0:
                                node_list[nearest_other_ch]["E"] -= (self.radio.reception_energy(k) + self.radio.aggregation_energy(k))
                            transmit_to_bs = False
                            
                    if transmit_to_bs:
                        d = np.sqrt((node_list[ch_idx]["x"] - sink_x)**2 + (node_list[ch_idx]["y"] - sink_y)**2)
                        node_list[ch_idx]["E"] -= self.radio.transmission_energy(d, k)
                        
            # 5. Standalone Nodes (if no CH or cluster available, direct to BS)
            assigned_nodes = set(ch_list)
            for m_list in clusters.values():
                assigned_nodes.update(m_list)
                
            for i, node in enumerate(node_list):
                if node["E"] > 0 and i not in assigned_nodes:
                    node["E"] -= self.radio.idle_energy_drain
                    d = np.sqrt((node["x"] - sink_x)**2 + (node["y"] - sink_y)**2)
                    node["E"] -= self.radio.transmission_energy(d, k)
                    
            # Record Round Metrics
            alive_count = sum(1 for node in node_list if node["E"] > 0)
            total_energy = sum(node["E"] for node in node_list if node["E"] > 0)
            avg_energy = (total_energy / alive_count) if alive_count > 0 else 0.0
            
            alive_history.append(alive_count)
            energy_history.append(avg_energy)
            
            if fnd == -1 and alive_count < num_nodes:
                fnd = r + 1
            if hnd == -1 and alive_count <= num_nodes / 2.0:
                hnd = r + 1
            if lnd == -1 and alive_count == 0:
                lnd = r + 1
                
        return alive_history, energy_history, fnd, hnd, lnd
