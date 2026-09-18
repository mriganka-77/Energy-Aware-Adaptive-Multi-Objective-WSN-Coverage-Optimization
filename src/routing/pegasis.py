"""
PEGASIS (Power-Efficient GAthering in Sensor Information Systems) Protocol Module.
Implements greedy nearest-neighbor chain construction, intra-chain data passing,
and token-rotated leader transmission to the Base Station.
"""

from typing import List, Dict, Tuple, Optional
import numpy as np

from src.routing.radio_energy_model import RadioEnergyModel
from src.models.sensor import SensorNode


class PEGASISSimulator:
    """Simulates PEGASIS chain-based routing protocol over multiple rounds."""
    
    def __init__(self, radio_model: Optional[RadioEnergyModel] = None):
        self.radio = radio_model or RadioEnergyModel()
        
    def _create_chain(self, nodes: List[Dict[str, float]]) -> List[int]:
        """
        Constructs a greedy nearest-neighbor chain across all currently alive nodes,
        beginning with the node farthest from the Base Station.
        """
        alive_indices = [i for i, node in enumerate(nodes) if node["E"] > 0]
        if not alive_indices:
            return []
            
        sink_x, sink_y = self.radio.sink_x, self.radio.sink_y
        distances_to_sink = [np.sqrt((nodes[i]["x"] - sink_x)**2 + (nodes[i]["y"] - sink_y)**2) for i in alive_indices]
        
        farthest_alive_idx = int(np.argmax(distances_to_sink))
        start_idx = alive_indices[farthest_alive_idx]
        
        chain = [start_idx]
        remaining = [idx for idx in alive_indices if idx != start_idx]
        
        while remaining:
            last = chain[-1]
            distances_from_last = [
                np.sqrt((nodes[last]["x"] - nodes[rem]["x"])**2 + (nodes[last]["y"] - nodes[rem]["y"])**2)
                for rem in remaining
            ]
            nearest_rem_idx = int(np.argmin(distances_from_last))
            nearest_node_idx = remaining[nearest_rem_idx]
            
            chain.append(nearest_node_idx)
            remaining.remove(nearest_node_idx)
            
        return chain

    def run_simulation(
        self,
        nodes: List[Dict[str, float]],
        max_rounds: int = 1000
    ) -> Tuple[List[int], List[float], int, int, int]:
        """
        Runs PEGASIS routing simulation.
        
        Returns:
            (alive_per_round, energy_per_round, fnd, hnd, lnd)
        """
        node_list = []
        for n in nodes:
            if isinstance(n, SensorNode):
                node_list.append({"x": n.x, "y": n.y, "E": n.residual_energy})
            elif isinstance(n, dict):
                node_list.append({"x": float(n["x"]), "y": float(n["y"]), "E": float(n["E"])})
            else:
                node_list.append({"x": float(n[0]), "y": float(n[1]), "E": 0.5})
                
        num_nodes = len(node_list)
        alive_history = []
        energy_history = []
        
        fnd = -1
        hnd = -1
        lnd = -1
        
        k = self.radio.packet_size
        sink_x, sink_y = self.radio.sink_x, self.radio.sink_y
        
        for r in range(max_rounds):
            chain = self._create_chain(node_list)
            if not chain:
                alive_history.append(0)
                energy_history.append(0.0)
                if lnd == -1: lnd = r + 1
                continue
                
            leader = chain[r % len(chain)]
            
            # 1. Data Transmission Along Chain
            for i in range(len(chain) - 1):
                a, b = chain[i], chain[i + 1]
                if node_list[a]["E"] > 0:
                    node_list[a]["E"] -= self.radio.idle_energy_drain
                    d = np.sqrt((node_list[a]["x"] - node_list[b]["x"])**2 + (node_list[a]["y"] - node_list[b]["y"])**2)
                    node_list[a]["E"] -= self.radio.transmission_energy(d, k)
                    
                    if node_list[b]["E"] > 0:
                        node_list[b]["E"] -= (self.radio.reception_energy(k) + self.radio.aggregation_energy(k))
                        
            # 2. Leader Transmits Aggregated Data to Base Station
            if node_list[leader]["E"] > 0:
                node_list[leader]["E"] -= self.radio.idle_energy_drain
                d = np.sqrt((node_list[leader]["x"] - sink_x)**2 + (node_list[leader]["y"] - sink_y)**2)
                node_list[leader]["E"] -= self.radio.transmission_energy(d, k)
                
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
