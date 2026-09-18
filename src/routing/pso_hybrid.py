"""
PSO-based Hybrid LEACH-PEGASIS Routing Protocol Module.
Uses Particle Swarm Optimization to dynamically select optimal Cluster Heads
balancing residual energy, sink distance, and intra-cluster compactness,
followed by intra-cluster PEGASIS chain formation and data aggregation.
"""

from typing import List, Dict, Tuple, Optional, Union
import numpy as np

from src.routing.radio_energy_model import RadioEnergyModel
from src.models.sensor import SensorNode
from src.models.network import WSNNetwork


class PSOHybridWSNSimulator:
    """
    Particle Swarm Optimization (PSO) based Hybrid LEACH-PEGASIS Simulator.
    Supports heterogeneous energy models and multi-metric fitness CH selection.
    """
    def __init__(
        self,
        radio_model: Optional[RadioEnergyModel] = None,
        ch_ratio: float = 0.05,
        num_particles: int = 20,
        max_pso_iter: int = 15,
        heterogeneous: bool = False,
        alpha: float = 1.0,
        beta: float = 2.0,
        m_adv: float = 0.2,
        m_sup: float = 0.1
    ):
        self.radio = radio_model or RadioEnergyModel()
        self.ch_ratio = ch_ratio
        self.num_particles = num_particles
        self.max_pso_iter = max_pso_iter
        self.heterogeneous = heterogeneous
        self.alpha = alpha
        self.beta = beta
        self.m_adv = m_adv
        self.m_sup = m_sup

    def _dist(self, a: Dict[str, float], b: Dict[str, float]) -> float:
        return float(np.sqrt((a["x"] - b["x"])**2 + (a["y"] - b["y"])**2))

    def _dist_to_sink(self, a: Dict[str, float]) -> float:
        return float(np.sqrt((a["x"] - self.radio.sink_x)**2 + (a["y"] - self.radio.sink_y)**2))

    def _evaluate_fitness(self, ch_list: List[int], alive_indices: List[int], nodes: List[Dict[str, float]]) -> float:
        if len(ch_list) == 0:
            return -1e9
        
        ch_energies = [nodes[idx]["E"] for idx in ch_list]
        avg_ch_energy = float(np.mean(ch_energies))
        
        ch_sink_dists = [self._dist_to_sink(nodes[idx]) for idx in ch_list]
        avg_sink_dist = float(np.mean(ch_sink_dists))
        
        non_ch = [idx for idx in alive_indices if idx not in ch_list]
        if non_ch:
            intra_dists = [min([self._dist(nodes[n_idx], nodes[ch]) for ch in ch_list]) for n_idx in non_ch]
            avg_intra_dist = float(np.mean(intra_dists))
        else:
            avg_intra_dist = 1.0
            
        return (2.0 * avg_ch_energy) + (100.0 / (avg_sink_dist + 1e-5)) + (50.0 / (avg_intra_dist + 1e-5))

    def _pso_ch_selection(self, alive_indices: List[int], num_ch: int, nodes: List[Dict[str, float]]) -> List[int]:
        if len(alive_indices) <= num_ch:
            return alive_indices

        particles = [np.random.choice(alive_indices, size=num_ch, replace=False).tolist() for _ in range(self.num_particles)]
        pbest = [list(p) for p in particles]
        pbest_fitness = [self._evaluate_fitness(p, alive_indices, nodes) for p in particles]
        
        gbest_idx = int(np.argmax(pbest_fitness))
        gbest = list(particles[gbest_idx])
        gbest_fitness = pbest_fitness[gbest_idx]
        
        for _ in range(self.max_pso_iter):
            for p_i in range(self.num_particles):
                if np.random.rand() < 0.3:
                    idx_to_change = np.random.randint(0, num_ch)
                    new_ch = int(np.random.choice(alive_indices))
                    if new_ch not in particles[p_i]:
                        particles[p_i][idx_to_change] = new_ch

                current_fitness = self._evaluate_fitness(particles[p_i], alive_indices, nodes)
                if current_fitness > pbest_fitness[p_i]:
                    pbest[p_i] = list(particles[p_i])
                    pbest_fitness[p_i] = current_fitness
                    if current_fitness > gbest_fitness:
                        gbest = list(particles[p_i])
                        gbest_fitness = current_fitness
                        
        return gbest

    def run_simulation(
        self,
        nodes: Union[List[SensorNode], WSNNetwork, List[Dict[str, float]], np.ndarray],
        max_rounds: int = 1000
    ) -> Tuple[List[int], List[float], int, int, int]:
        """
        Runs PSO-Hybrid routing simulation.
        
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
        
        for r in range(max_rounds):
            alive_indices = [i for i, n in enumerate(node_list) if n["E"] > 0]
            num_alive = len(alive_indices)
            
            if fnd == -1 and num_alive < num_nodes:
                fnd = r
            if hnd == -1 and num_alive <= num_nodes // 2:
                hnd = r
            if lnd == -1 and num_alive == 0:
                lnd = r
                
            if num_alive == 0:
                alive_history.append(0)
                energy_history.append(0.0)
                continue
                
            # Select CHs using PSO
            num_ch = max(1, int(self.ch_ratio * num_alive))
            CH = self._pso_ch_selection(alive_indices, num_ch=num_ch, nodes=node_list)
            
            # Form clusters around CHs
            clusters = {ch: [] for ch in CH}
            for idx in alive_indices:
                if idx not in CH:
                    nearest_ch = min(CH, key=lambda c: self._dist(node_list[idx], node_list[c]))
                    clusters[nearest_ch].append(idx)

            # Intra-cluster PEGASIS chain transmission
            for ch, members in clusters.items():
                if members:
                    chain = members.copy()
                    ordered = [chain.pop(0)]
                    while chain:
                        last = ordered[-1]
                        nearest = min(chain, key=lambda m: self._dist(node_list[last], node_list[m]))
                        ordered.append(nearest)
                        chain.remove(nearest)
                    
                    local_k = float(k)
                    for i_c in range(len(ordered) - 1):
                        u, v = ordered[i_c], ordered[i_c + 1]
                        if node_list[u]["E"] > 0:
                            node_list[u]["E"] -= 0.00005
                            d = self._dist(node_list[u], node_list[v])
                            tx_e = local_k * self.radio.etx + (
                                local_k * self.radio.emp * (d**4) if d > do else local_k * self.radio.efs * (d**2)
                            )
                            node_list[u]["E"] -= tx_e
                            if node_list[v]["E"] > 0:
                                node_list[v]["E"] -= (local_k * self.radio.erx + local_k * self.radio.eda)
                            local_k *= 0.9 # Aggregation

                    # Send to CH
                    last_m = ordered[-1]
                    if node_list[last_m]["E"] > 0:
                        node_list[last_m]["E"] -= 0.00005
                        d = self._dist(node_list[last_m], node_list[ch])
                        tx_e = local_k * self.radio.etx + (
                            local_k * self.radio.emp * (d**4) if d > do else local_k * self.radio.efs * (d**2)
                        )
                        node_list[last_m]["E"] -= tx_e
                        if node_list[ch]["E"] > 0:
                            node_list[ch]["E"] -= (local_k * self.radio.erx + local_k * self.radio.eda)

            # CH transmission to Base Station
            for ch in CH:
                if node_list[ch]["E"] > 0:
                    d_bs = self._dist_to_sink(node_list[ch])
                    tx_e = k * self.radio.etx + (
                        k * self.radio.emp * (d_bs**4) if d_bs > do else k * self.radio.efs * (d_bs**2)
                    )
                    node_list[ch]["E"] -= tx_e
                    
            for n in node_list:
                if n["E"] < 0:
                    n["E"] = 0.0
                    
            alive_count = sum(1 for n in node_list if n["E"] > 0)
            avg_energy = float(np.mean([n["E"] for n in node_list if n["E"] > 0])) if alive_count > 0 else 0.0
            
            alive_history.append(alive_count)
            energy_history.append(avg_energy)

        if fnd == -1: fnd = max_rounds
        if hnd == -1: hnd = max_rounds
        if lnd == -1: lnd = max_rounds
        
        return alive_history, energy_history, fnd, hnd, lnd
