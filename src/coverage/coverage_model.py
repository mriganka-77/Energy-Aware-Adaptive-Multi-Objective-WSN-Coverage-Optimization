"""
Vectorized Grid-Based Sensing Coverage Model.
Evaluates binary disk sensing coverage across a discretized 2D grid matrix
using optimized NumPy broadcasting for maximum execution speed.
"""

from typing import Tuple, List, Union
import numpy as np

from src.models.sensor import SensorNode
from src.models.network import WSNNetwork


class CoverageEvaluator:
    """Computes spatial grid coverage metrics using vectorized NumPy operations."""
    
    def __init__(self, field_width: float = 100.0, field_height: float = 100.0, resolution: float = 1.0):
        self.width = float(field_width)
        self.height = float(field_height)
        self.resolution = float(resolution)
        
        # Construct 2D coordinate meshgrid
        self.x_coords = np.arange(0, self.width + self.resolution / 2.0, self.resolution)
        self.y_coords = np.arange(0, self.height + self.resolution / 2.0, self.resolution)
        self.grid_x, self.grid_y = np.meshgrid(self.x_coords, self.y_coords)
        
        # Flattened grid coordinates of shape (num_grid_points, 2)
        self.grid_points = np.column_stack([self.grid_x.ravel(), self.grid_y.ravel()])
        self.num_grid_points = len(self.grid_points)
        self.total_area = self.width * self.height
        
    def compute_coverage_matrix(
        self,
        node_positions: Union[np.ndarray, List[SensorNode], WSNNetwork],
        sensing_radius: float = 15.0
    ) -> np.ndarray:
        """
        Computes the coverage count matrix for every grid point.
        
        Args:
            node_positions: (N, 2) array of coordinates, list of SensorNode objects, or WSNNetwork.
            sensing_radius: Sensing radius Rs in meters.
            
        Returns:
            2D NumPy array of shape (len(y_coords), len(x_coords)) where each entry is
            the integer number of sensors covering that grid point.
        """
        # Extract coordinates array
        if isinstance(node_positions, WSNNetwork):
            coords = np.array([[n.x, n.y] for n in node_positions.get_alive_nodes()], dtype=np.float64)
            if len(node_positions.nodes) > 0:
                sensing_radius = node_positions.nodes[0].sensing_radius
        elif isinstance(node_positions, list):
            coords = np.array([[n.x, n.y] for n in node_positions if n.is_alive and n.residual_energy > 0], dtype=np.float64)
            if len(node_positions) > 0 and hasattr(node_positions[0], 'sensing_radius'):
                sensing_radius = node_positions[0].sensing_radius
        else:
            coords = np.asarray(node_positions, dtype=np.float64)
            
        if len(coords) == 0:
            return np.zeros_like(self.grid_x, dtype=np.int32)
            
        # Fast vectorized distance calculation via broadcasting
        # grid_points: (G, 2), coords: (N, 2)
        # diff: (G, N, 2) -> dist_sq: (G, N)
        diff = self.grid_points[:, np.newaxis, :] - coords[np.newaxis, :, :]
        dist_sq = np.sum(diff**2, axis=-1) # shape (G, N)
        
        # Check within sensing disk (dist_sq <= Rs^2)
        covered_mask = dist_sq <= (sensing_radius**2) # boolean (G, N)
        
        # Count number of sensors covering each grid point
        count_per_point = np.sum(covered_mask, axis=1) # shape (G,)
        
        # Reshape to 2D grid matrix
        count_matrix = count_per_point.reshape(self.grid_x.shape).astype(np.int32)
        return count_matrix

    def evaluate_coverage(
        self,
        node_positions: Union[np.ndarray, List[SensorNode], WSNNetwork],
        sensing_radius: float = 15.0
    ) -> Tuple[float, np.ndarray]:
        """
        Computes the coverage ratio (CR) as a percentage (0.0% to 100.0%).
        
        Returns:
            (coverage_percentage, count_matrix)
        """
        count_matrix = self.compute_coverage_matrix(node_positions, sensing_radius)
        num_covered_points = np.count_nonzero(count_matrix > 0)
        coverage_ratio = (num_covered_points / self.num_grid_points) * 100.0
        return coverage_ratio, count_matrix
