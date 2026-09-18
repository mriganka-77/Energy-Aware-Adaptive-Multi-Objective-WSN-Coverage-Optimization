"""
Centroidal Voronoi Tessellation (CVT) Deployment Optimizer.
Disperses sensors toward the geometric centroids of their bounded Voronoi cells
with damping and boundary repulsion to prevent cluster collapse.
"""

from typing import Tuple, List
import numpy as np

from src.models.network import WSNNetwork
from src.coverage.voronoi import VoronoiAnalyzer
from src.coverage.coverage_model import CoverageEvaluator


class VoronoiOptimizer:
    """Optimizes sensor placement via Centroidal Voronoi Tessellation."""
    
    def __init__(
        self,
        field_width: float = 100.0,
        field_height: float = 100.0,
        sensing_radius: float = 15.0,
        damping: float = 0.25
    ):
        self.width = float(field_width)
        self.height = float(field_height)
        self.sensing_radius = float(sensing_radius)
        self.damping = float(damping)
        
        self.voronoi_analyzer = VoronoiAnalyzer(self.width, self.height)
        self.evaluator = CoverageEvaluator(self.width, self.height, resolution=2.0)
        
    def optimize(
        self,
        network: WSNNetwork,
        max_iterations: int = 40
    ) -> Tuple[np.ndarray, List[float]]:
        """
        Moves sensors iteratively toward their Voronoi cell centroids.
        """
        coords = np.copy(network.get_positions_array())
        history = []
        
        for it in range(max_iterations):
            cov, _ = self.evaluator.evaluate_coverage(coords, self.sensing_radius)
            history.append(cov)
            
            cells = self.voronoi_analyzer.compute_bounded_voronoi(coords)
            if not cells:
                break
                
            for cell in cells:
                node_id = cell['node_id']
                if node_id >= len(coords): continue
                cx, cy = cell['centroid']
                
                # Move toward centroid with gentle damping step
                dx = cx - coords[node_id, 0]
                dy = cy - coords[node_id, 1]
                dist = np.hypot(dx, dy)
                
                if dist > 0:
                    step = min(dist * self.damping, 2.0)
                    coords[node_id, 0] += (dx / dist) * step
                    coords[node_id, 1] += (dy / dist) * step
                    
            coords[:, 0] = np.clip(coords[:, 0], 2.0, self.width - 2.0)
            coords[:, 1] = np.clip(coords[:, 1], 2.0, self.height - 2.0)
            
        final_cov, _ = self.evaluator.evaluate_coverage(coords, self.sensing_radius)
        history.append(final_cov)
        return coords, history
