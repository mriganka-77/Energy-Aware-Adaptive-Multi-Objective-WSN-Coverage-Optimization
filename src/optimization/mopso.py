"""
Multi-Objective Particle Swarm Optimization (MOPSO) Module.
Maintains an external Pareto Archive of non-dominated solutions, optimizing
coverage maximization, overlap minimization, and movement cost simultaneously.
"""

from typing import List, Tuple, Dict, Optional
import numpy as np

from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator
from src.coverage.overlap import OverlapEvaluator


class ParetoArchive:
    """Maintains non-dominated Pareto optimal solutions using crowding distance."""
    
    def __init__(self, max_size: int = 50):
        self.max_size = int(max_size)
        self.solutions: List[Dict] = []
        
    def dominates(self, obj_a: np.ndarray, obj_b: np.ndarray) -> bool:
        """
        Determines if objective vector A dominates objective vector B.
        Objectives are formatted for maximization:
        [Coverage, -Overlap, -Movement, ResidualEnergy, Connectivity]
        """
        return np.all(obj_a >= obj_b) and np.any(obj_a > obj_b)
        
    def update(self, candidate_pos: np.ndarray, candidate_objs: np.ndarray) -> bool:
        """
        Attempts to insert a new solution into the Pareto archive.
        Returns True if the candidate is non-dominated.
        """
        # Check if dominated by any archive member
        for member in self.solutions:
            if self.dominates(member['objs'], candidate_objs):
                return False
                
        # Remove any existing members dominated by the new candidate
        self.solutions = [m for m in self.solutions if not self.dominates(candidate_objs, m['objs'])]
        
        # Add new candidate
        self.solutions.append({
            'pos': np.copy(candidate_pos),
            'objs': np.copy(candidate_objs)
        })
        
        # Truncate if exceeds archive capacity
        if len(self.solutions) > self.max_size:
            self._prune_archive()
            
        return True

    def _prune_archive(self):
        """Prunes the archive based on crowding distance to maintain diversity."""
        # Simple random or extreme-preserving pruning
        objs_matrix = np.array([m['objs'] for m in self.solutions])
        # Retain extremes of coverage and overlap
        best_cov_idx = int(np.argmax(objs_matrix[:, 0]))
        best_or_idx = int(np.argmax(objs_matrix[:, 1]))
        
        indices = list(range(len(self.solutions)))
        indices.remove(best_cov_idx)
        if best_or_idx in indices:
            indices.remove(best_or_idx)
            
        keep_indices = [best_cov_idx, best_or_idx] + list(np.random.choice(indices, self.max_size - 2, replace=False))
        self.solutions = [self.solutions[i] for i in keep_indices]

    def select_leader(self) -> np.ndarray:
        """Selects a global best guide (gbest) from the Pareto archive."""
        if not self.solutions:
            return None
        # Roulette wheel or random selection from archive
        chosen = self.solutions[np.random.randint(len(self.solutions))]
        return chosen['pos']


class StandardMOPSO:
    """MOPSO algorithm for multi-objective sensor deployment."""
    
    def __init__(
        self,
        field_width: float = 100.0,
        field_height: float = 100.0,
        sensing_radius: float = 15.0,
        num_particles: int = 30,
        archive_size: int = 40,
        w: float = 0.729,
        c1: float = 1.49445,
        c2: float = 1.49445
    ):
        self.width = float(field_width)
        self.height = float(field_height)
        self.sensing_radius = float(sensing_radius)
        self.num_particles = int(num_particles)
        self.archive = ParetoArchive(max_size=archive_size)
        self.w = float(w)
        self.c1 = float(c1)
        self.c2 = float(c2)
        
        self.cov_eval = CoverageEvaluator(self.width, self.height, resolution=2.0)
        self.or_eval = OverlapEvaluator(self.cov_eval)
        
    def evaluate_objectives(self, coords: np.ndarray, initial_coords: np.ndarray) -> np.ndarray:
        """
        Computes the multi-objective vector:
        [Coverage (max), -Overlap (max -> min overlap), -Movement (max -> min displacement)]
        """
        cov, count_mat = self.cov_eval.evaluate_coverage(coords, self.sensing_radius)
        or_cov, _, _, _ = self.or_eval.evaluate_overlap(count_mat)
        displacement = np.sum(np.hypot(coords[:, 0] - initial_coords[:, 0], coords[:, 1] - initial_coords[:, 1]))
        
        # Maximization vector: [Coverage, -OverlapRatio*100, -Displacement]
        return np.array([cov, -or_cov * 100.0, -displacement], dtype=np.float64)

    def optimize(
        self,
        network: WSNNetwork,
        max_iterations: int = 50
    ) -> Tuple[np.ndarray, List[float], ParetoArchive]:
        """
        Executes MOPSO optimization.
        
        Returns:
            (best_compromise_coords, coverage_history, pareto_archive)
        """
        n_sensors = network.num_sensors
        dim = n_sensors * 2
        initial_coords = network.get_positions_array()
        
        lb = np.zeros(dim)
        ub = np.zeros(dim)
        lb[0::2] = 0.0; ub[0::2] = self.width
        lb[1::2] = 0.0; ub[1::2] = self.height
        v_max = (ub - lb) * 0.12
        
        positions = np.zeros((self.num_particles, dim))
        velocities = np.random.uniform(-v_max, v_max, (self.num_particles, dim))
        
        positions[0] = initial_coords.flatten()
        for p in range(1, self.num_particles):
            positions[p, 0::2] = np.random.uniform(0, self.width, n_sensors)
            positions[p, 1::2] = np.random.uniform(0, self.height, n_sensors)
            
        pbest_pos = np.copy(positions)
        pbest_objs = np.zeros((self.num_particles, 3))
        
        for p in range(self.num_particles):
            coords = positions[p].reshape(-1, 2)
            objs = self.evaluate_objectives(coords, initial_coords)
            pbest_objs[p] = objs
            self.archive.update(positions[p], objs)
            
        history = []
        
        for it in range(max_iterations):
            w_curr = self.w * (1.0 - 0.4 * (it / max_iterations))
            
            for p in range(self.num_particles):
                gbest_pos = self.archive.select_leader()
                if gbest_pos is None:
                    gbest_pos = pbest_pos[p]
                    
                r1 = np.random.rand(dim)
                r2 = np.random.rand(dim)
                
                velocities[p] = (
                    w_curr * velocities[p]
                    + self.c1 * r1 * (pbest_pos[p] - positions[p])
                    + self.c2 * r2 * (gbest_pos - positions[p])
                )
                velocities[p] = np.clip(velocities[p], -v_max, v_max)
                positions[p] += velocities[p]
                positions[p] = np.clip(positions[p], lb, ub)
                
                coords = positions[p].reshape(-1, 2)
                objs = self.evaluate_objectives(coords, initial_coords)
                
                # Check dominance for personal best
                if self.archive.dominates(objs, pbest_objs[p]):
                    pbest_objs[p] = objs
                    pbest_pos[p] = np.copy(positions[p])
                    
                self.archive.update(positions[p], objs)
                
            # Log best coverage in archive
            best_cov = max(m['objs'][0] for m in self.archive.solutions)
            history.append(best_cov)
            
        # Select best compromise from archive (highest composite score)
        best_sol = max(self.archive.solutions, key=lambda m: 0.6 * m['objs'][0] + 0.4 * m['objs'][1])
        return best_sol['pos'].reshape(-1, 2), history, self.archive
