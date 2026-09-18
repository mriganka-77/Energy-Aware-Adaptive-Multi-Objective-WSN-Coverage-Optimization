"""
Virtual Force Algorithm (VFA) Deployment Optimizer.
Computes attractive forces toward coverage holes, repulsive forces between
overlapping sensors, and boundary forces, bounded by max displacement D_max.
"""

from typing import List, Tuple, Optional
import numpy as np

from src.models.sensor import SensorNode
from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator
from src.coverage.holes import HoleDetector


class VirtualForceOptimizer:
    """Optimizes sensor deployments using physical virtual force fields."""
    
    def __init__(
        self,
        field_width: float = 100.0,
        field_height: float = 100.0,
        sensing_radius: float = 15.0,
        w_attraction: float = 0.5,
        w_repulsion: float = 0.8,
        w_boundary: float = 1.0,
        max_displacement: float = 2.0
    ):
        self.width = float(field_width)
        self.height = float(field_height)
        self.sensing_radius = float(sensing_radius)
        self.w_att = float(w_attraction)
        self.w_rep = float(w_repulsion)
        self.w_bound = float(w_boundary)
        self.d_max = float(max_displacement)
        
        self.coverage_eval = CoverageEvaluator(self.width, self.height, resolution=2.0)
        self.hole_detector = HoleDetector(self.coverage_eval)
        
    def calculate_forces(
        self,
        coords: np.ndarray,
        hole_coords: Optional[np.ndarray] = None
    ) -> np.ndarray:
        """
        Calculates net force vector (Fx, Fy) for every sensor.
        
        Args:
            coords: (N, 2) array of sensor coordinates
            hole_coords: Optional (H, 2) array of uncovered hole points
            
        Returns:
            (N, 2) array of net displacement force vectors
        """
        n = len(coords)
        forces = np.zeros((n, 2), dtype=np.float64)
        threshold_dist = 2.0 * self.sensing_radius # Distance where sensors start overlapping
        
        # 1. Inter-Sensor Repulsive Force (push overlapping sensors apart vigorously)
        # Optimal distance in hexagonal packing is d_opt = sqrt(3) * Rs approx 1.732 * Rs
        d_opt = np.sqrt(3) * self.sensing_radius
        for i in range(n):
            for j in range(n):
                if i == j: continue
                dx = coords[i, 0] - coords[j, 0]
                dy = coords[i, 1] - coords[j, 1]
                dist = np.hypot(dx, dy)
                
                if 0 < dist < threshold_dist:
                    # Non-linear quadratic force: surge if dist < Rs (severe cluster)
                    overlap_ratio = (threshold_dist - dist) / threshold_dist
                    f_mag = self.w_rep * (overlap_ratio ** 1.8) * (2.5 if dist < self.sensing_radius else 1.2)
                    angle = np.arctan2(dy, dx)
                    forces[i, 0] += f_mag * np.cos(angle)
                    forces[i, 1] += f_mag * np.sin(angle)
                    
        # 2. Attractive Force toward Coverage Holes
        if hole_coords is not None and len(hole_coords) > 0:
            # Subsample holes for fast computation if large
            if len(hole_coords) > 200:
                indices = np.random.choice(len(hole_coords), 200, replace=False)
                sub_holes = hole_coords[indices]
            else:
                sub_holes = hole_coords
                
            for i in range(n):
                for h in sub_holes:
                    dx = h[0] - coords[i, 0]
                    dy = h[1] - coords[i, 1]
                    dist = np.hypot(dx, dy)
                    
                    if threshold_dist * 0.5 < dist < threshold_dist * 2.5:
                        f_mag = self.w_att * (1.0 / (dist + 1e-3))
                        angle = np.arctan2(dy, dx)
                        forces[i, 0] += f_mag * np.cos(angle)
                        forces[i, 1] += f_mag * np.sin(angle)
                        
        # 3. Boundary Repulsive Force (keep sensors inside field)
        margin = self.sensing_radius * 0.75
        for i in range(n):
            x, y = coords[i, 0], coords[i, 1]
            if x < margin:
                forces[i, 0] += self.w_bound * ((margin - x) / margin)
            elif x > self.width - margin:
                forces[i, 0] -= self.w_bound * ((x - (self.width - margin)) / margin)
                
            if y < margin:
                forces[i, 1] += self.w_bound * ((margin - y) / margin)
            elif y > self.height - margin:
                forces[i, 1] -= self.w_bound * ((y - (self.height - margin)) / margin)
                
        # Clamp forces to max_displacement D_max
        for i in range(n):
            mag = np.hypot(forces[i, 0], forces[i, 1])
            if mag > self.d_max:
                forces[i] = (forces[i] / mag) * self.d_max
                
        return forces

    def optimize(
        self,
        network: WSNNetwork,
        max_iterations: int = 50
    ) -> Tuple[np.ndarray, List[float]]:
        """
        Runs VFA optimization over max_iterations.
        
        Returns:
            (optimized_coords, coverage_history)
        """
        coords = network.get_positions_array()
        history = []
        
        for it in range(max_iterations):
            # Compute coverage and holes
            cov_ratio, count_mat = self.coverage_eval.evaluate_coverage(coords, self.sensing_radius)
            history.append(cov_ratio)
            
            hole_coords = self.hole_detector.get_hole_coordinates(count_mat)
            forces = self.calculate_forces(coords, hole_coords)
            
            # Apply displacement
            coords += forces
            coords[:, 0] = np.clip(coords[:, 0], 0.0, self.width)
            coords[:, 1] = np.clip(coords[:, 1], 0.0, self.height)
            
        final_cov, _ = self.coverage_eval.evaluate_coverage(coords, self.sensing_radius)
        history.append(final_cov)
        return coords, history
