"""
LEACH (Low-Energy Adaptive Clustering Hierarchy) Protocol Module.
Implements dynamic cluster formation, randomized Cluster Head (CH) election,
and direct-to-CH / CH-to-BS communication rounds.
"""

from typing import List, Dict, Tuple, Optional
import numpy as np

from src.routing.radio_energy_model import RadioEnergyModel
from src.models.sensor import SensorNode
from src.models.network import WSNNetwork


class LEACHSimulator:
    """Simulates LEACH clustered routing protocol over multiple rounds."""
    
    def __init__(self, radio_model: Optional[RadioEnergyModel] = None, p_ch: float = 0.1):
        self.radio = radio_model or RadioEnergyModel()
        self.p_ch = float(p_ch)
        
    def run_simulation(
        self,
        nodes: List[Dict[str, float]],
        max_rounds: int = 1000
    ) -> Tuple[List[int], List[float], int, int, int]:
        """
        Runs LEACH routing simulation.
        
        Args:
            nodes: List of dicts with keys 'x', 'y', 'E' (or list of SensorNode / WSNNetwork)
            max_rounds: Maximum simulation rounds (default: 1000)
            
        Returns:
            (alive_per_round, energy_per_round, fnd, hnd, lnd)
        """
        # Clone node data
        node_list = []
        for n in nodes:
            if isinstance(n, SensorNode):
                node_list.append({"x": n.x, "y": n.y, "E": n.residual_energy, "G": 0})
            elif isinstance(n, dict):
                node_list.append({"x": float(n["x"]), "y": float(n["y"]), "E": float(n["E"]), "G": 0})
            else:
                node_list.append({"x": float(n[0]), "y": float(n[1]), "E": 0.5, "G": 0})
                
        num_nodes = len(node_list)
        alive_history = []
        energy_history = []
        
        fnd = -1
        hnd = -1
        lnd = -1
        
        p = self.p_ch
        k = self.radio.packet_size
        do = self.radio.d0
        sink_x, sink_y = self.radio.sink_x, self.radio.sink_y
        
        for r in range(max_rounds):
            # Reset G counter every 1/p rounds
            if r % max(1, int(1.0 / p)) == 0:
                for node in node_list:
                    node["G"] = 0
                    
            # 1. Cluster Head Election
            ch_indices = []
            for i, node in enumerate(node_list):
                if node["E"] > 0 and node["G"] == 0:
                    if np.random.rand() <= p:
                        node["G"] = int(1.0 / p)
                        ch_indices.append(i)
                        
            # 2. Member Node Transmission to Nearest CH (or directly to BS if no CH)
            for i, node in enumerate(node_list):
                if node["E"] <= 0:
                    continue
                    
                # Base sensing drain
                node["E"] -= self.radio.idle_energy_drain
                
                if ch_indices:
                    # Find nearest CH
                    distances = [np.sqrt((node["x"] - node_list[c]["x"])**2 + (node["y"] - node_list[c]["y"])**2) for c in ch_indices]
                    min_idx = int(np.argmin(distances))
                    nearest_ch = ch_indices[min_idx]
                    d = distances[min_idx]
                    
                    node["E"] -= self.radio.transmission_energy(d, k)
                    node_list[nearest_ch]["E"] -= (self.radio.reception_energy(k) + self.radio.aggregation_energy(k))
                else:
                    # Direct to BS
                    d = np.sqrt((node["x"] - sink_x)**2 + (node["y"] - sink_y)**2)
                    node["E"] -= self.radio.transmission_energy(d, k)
                    
            # 3. Cluster Heads Transmit Aggregated Data to Base Station
            for c in ch_indices:
                if node_list[c]["E"] > 0:
                    d = np.sqrt((node_list[c]["x"] - sink_x)**2 + (node_list[c]["y"] - sink_y)**2)
                    node_list[c]["E"] -= self.radio.transmission_energy(d, k)
                    
            # Record Round Metrics
            alive_count = sum(1 for node in node_list if node["E"] > 0)
            total_energy = sum(node["E"] for node in node_list if node["E"] > 0)
            avg_energy = (total_energy / alive_count) if alive_count > 0 else 0.0
            
            alive_history.append(alive_count)
            energy_history.append(avg_energy)
            
            # Lifetime milestones
            if fnd == -1 and alive_count < num_nodes:
                fnd = r + 1
            if hnd == -1 and alive_count <= num_nodes / 2.0:
                hnd = r + 1
            if lnd == -1 and alive_count == 0:
                lnd = r + 1
                
        return alive_history, energy_history, fnd, hnd, lnd
