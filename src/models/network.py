"""
WSN Network Environment Model.
Manages the physical 2D sensing field, sensor collection, Base Station,
initial random deployment generation, and network connectivity graph analysis.
"""

import random
from typing import List, Tuple, Optional
import numpy as np

from src.config.simulation_config import NetworkConfig
from src.models.sensor import SensorNode


class WSNNetwork:
    """Manages the overall sensor network environment and node collection."""
    
    def __init__(self, config: Optional[NetworkConfig] = None):
        self.config = config or NetworkConfig()
        self.width = self.config.field_width
        self.height = self.config.field_height
        self.num_sensors = self.config.num_sensors
        self.sensing_radius = self.config.sensing_radius
        self.communication_radius = self.config.communication_radius
        self.initial_energy = self.config.initial_energy
        self.sink_x, self.sink_y = self.config.sink_position
        self.nodes: List[SensorNode] = []
        
        # Initialize network deployment
        self.generate_deployment(seed=self.config.random_seed)
        
    def generate_deployment(self, seed: Optional[int] = None) -> List[SensorNode]:
        """
        Generates a deterministic random sensor deployment across the 2D field.
        """
        if seed is not None:
            random.seed(seed)
            np.random.seed(seed)
            
        self.nodes = []
        for i in range(self.num_sensors):
            # Uniform random coordinates within field boundaries
            x = random.uniform(0.0, self.width)
            y = random.uniform(0.0, self.height)
            node = SensorNode(
                node_id=i,
                x=x,
                y=y,
                sensing_radius=self.sensing_radius,
                communication_radius=self.communication_radius,
                initial_energy=self.initial_energy,
            )
            self.nodes.append(node)
            
        return self.nodes
    
    def set_custom_positions(self, positions: List[Tuple[float, float]]):
        """Sets custom (x, y) coordinates for all nodes in the network."""
        assert len(positions) == len(self.nodes), f"Expected {len(self.nodes)} positions, got {len(positions)}"
        for node, (x, y) in zip(self.nodes, positions):
            node.x = max(0.0, min(self.width, float(x)))
            node.y = max(0.0, min(self.height, float(y)))
            
    def get_positions_array(self) -> np.ndarray:
        """Returns node coordinates as an (N, 2) NumPy array."""
        return np.array([[node.x, node.y] for node in self.nodes], dtype=np.float64)
    
    def get_alive_nodes(self) -> List[SensorNode]:
        """Returns all currently alive sensor nodes with residual energy > 0."""
        return [node for node in self.nodes if node.is_alive and node.residual_energy > 0]
    
    def count_alive_nodes(self) -> int:
        """Returns the number of alive sensor nodes."""
        return len(self.get_alive_nodes())
    
    def get_total_residual_energy(self) -> float:
        """Calculates total remaining energy across all nodes in Joules."""
        return sum(node.residual_energy for node in self.nodes)
    
    def get_average_residual_energy(self) -> float:
        """Calculates average remaining energy per node in Joules."""
        if not self.nodes:
            return 0.0
        return self.get_total_residual_energy() / len(self.nodes)
    
    def get_total_movement_distance(self) -> float:
        """Calculates sum of Euclidean displacement across all nodes."""
        return sum(node.total_displacement for node in self.nodes)
    
    def compute_connectivity_factor(self) -> float:
        """
        Computes network connectivity factor K:
        K = (size of largest connected component) / N.
        Uses Breadth-First Search (BFS) over the communication graph.
        """
        alive_nodes = self.get_alive_nodes()
        if not alive_nodes:
            return 0.0
        
        n_alive = len(alive_nodes)
        if n_alive == 1:
            return 1.0 / self.num_sensors
        
        # Build adjacency list
        adj = {i: [] for i in range(n_alive)}
        for i in range(n_alive):
            for j in range(i + 1, n_alive):
                if alive_nodes[i].can_communicate_with(alive_nodes[j]):
                    adj[i].append(j)
                    adj[j].append(i)
                    
        # Find largest connected component with BFS
        visited = set()
        max_component_size = 0
        
        for i in range(n_alive):
            if i not in visited:
                queue = [i]
                visited.add(i)
                component_size = 0
                while queue:
                    curr = queue.pop(0)
                    component_size += 1
                    for neighbor in adj[curr]:
                        if neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)
                max_component_size = max(max_component_size, component_size)
                
        return max_component_size / self.num_sensors

    def reset_network(self):
        """Resets all nodes to their initial positions and initial energy."""
        for node in self.nodes:
            node.reset()
