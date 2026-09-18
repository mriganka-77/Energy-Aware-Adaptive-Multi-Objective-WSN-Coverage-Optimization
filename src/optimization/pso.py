"""
Standard Particle Swarm Optimization (PSO) for WSN Coverage.
Each particle represents a full candidate deployment X = [x1, y1, ..., xN, yN].
Optimizes sensing coverage ratio using cognitive and social acceleration.
"""

from typing import Tuple, List, Optional
import numpy as np

from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator


class StandardPSO:
    """Standard PSO algorithm for single-objective coverage maximization."""
    
    def __init__(
        self,
        field_width: float = 100.0,
        field_height: float = 100.0,
        sensing_radius: float = 15.0,
        num_particles: int = 30,
        w: float = 0.729,
        c1: float = 1.49445,
        c2: float = 1.49445
    ):
        self.width = float(field_width)
        self.height = float(field_height)
        self.sensing_radius = float(sensing_radius)
        self.num_particles = int(num_particles)
        self.w = float(w)
        self.c1 = float(c1)
        self.c2 = float(c2)
        
        # Fast evaluator
        self.evaluator = CoverageEvaluator(self.width, self.height, resolution=2.0)
        
    def optimize(
        self,
        network: WSNNetwork,
        max_iterations: int = 50
    ) -> Tuple[np.ndarray, List[float]]:
        """
        Runs PSO optimization.
        
        Returns:
            (best_positions, fitness_history)
        """
        n_sensors = network.num_sensors
        dim = n_sensors * 2 # [x1, y1, x2, y2, ..., xN, yN]
        
        # Upper and lower bounds
        lb = np.zeros(dim)
        ub = np.zeros(dim)
        for i in range(n_sensors):
            lb[2*i] = 0.0; ub[2*i] = self.width
            lb[2*i+1] = 0.0; ub[2*i+1] = self.height
            
        v_max = (ub - lb) * 0.15 # Max velocity
        
        # Initialize swarm
        positions = np.zeros((self.num_particles, dim))
        velocities = np.random.uniform(-v_max, v_max, (self.num_particles, dim))
        
        # Particle 0 starts at initial deployment
        initial_coords = network.get_positions_array().flatten()
        positions[0] = initial_coords
        for p in range(1, self.num_particles):
            positions[p] = np.random.uniform(lb, ub, dim)
            
        pbest_pos = np.copy(positions)
        pbest_val = np.zeros(self.num_particles)
        
        for p in range(self.num_particles):
            coords = positions[p].reshape(-1, 2)
            cov, _ = self.evaluator.evaluate_coverage(coords, self.sensing_radius)
            pbest_val[p] = cov
            
        gbest_idx = int(np.argmax(pbest_val))
        gbest_pos = np.copy(pbest_pos[gbest_idx])
        gbest_val = pbest_val[gbest_idx]
        
        history = [gbest_val]
        
        for it in range(max_iterations):
            # Dynamic inertia weight reduction
            w_curr = self.w * (1.0 - 0.5 * (it / max_iterations))
            
            for p in range(self.num_particles):
                r1 = np.random.rand(dim)
                r2 = np.random.rand(dim)
                
                # Velocity update
                velocities[p] = (
                    w_curr * velocities[p]
                    + self.c1 * r1 * (pbest_pos[p] - positions[p])
                    + self.c2 * r2 * (gbest_pos - positions[p])
                )
                velocities[p] = np.clip(velocities[p], -v_max, v_max)
                
                # Position update
                positions[p] += velocities[p]
                positions[p] = np.clip(positions[p], lb, ub)
                
                # Evaluate fitness
                coords = positions[p].reshape(-1, 2)
                cov, _ = self.evaluator.evaluate_coverage(coords, self.sensing_radius)
                
                if cov > pbest_val[p]:
                    pbest_val[p] = cov
                    pbest_pos[p] = np.copy(positions[p])
                    
                    if cov > gbest_val:
                        gbest_val = cov
                        gbest_pos = np.copy(positions[p])
                        
            history.append(gbest_val)
            
        best_coords = gbest_pos.reshape(-1, 2)
        return best_coords, history
