"""
Proposed Algorithm: Energy-Aware Adaptive Voronoi–Virtual Force MOPSO (EA-VVF-MOPSO).
Combines global Pareto swarm search with Voronoi geometry, Virtual Force micro-adjustments,
and residual energy mobility protection to achieve max coverage with min overlap and low displacement.
"""

from typing import List, Tuple, Dict, Optional
import numpy as np

from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator
from src.coverage.overlap import OverlapEvaluator
from src.coverage.holes import HoleDetector
from src.coverage.voronoi import VoronoiAnalyzer
from src.optimization.vfa import VirtualForceOptimizer
from src.optimization.mopso import ParetoArchive


class EAVVFMOPSO:
    """The Proposed Energy-Aware Adaptive Voronoi-Virtual Force MOPSO Framework."""
    
    def __init__(
        self,
        field_width: float = 100.0,
        field_height: float = 100.0,
        sensing_radius: float = 15.0,
        num_particles: int = 30,
        archive_size: int = 60,
        energy_threshold: float = 0.30,
        relocation_cost: float = 0.005,
        w: float = 0.72,
        c1: float = 1.49,
        c2: float = 1.49,
        vfa_weight: float = 0.45
    ):
        self.width = float(field_width)
        self.height = float(field_height)
        self.sensing_radius = float(sensing_radius)
        self.num_particles = int(num_particles)
        self.archive = ParetoArchive(max_size=archive_size)
        self.energy_threshold = float(energy_threshold)
        self.relocation_cost = float(relocation_cost)
        self.w = float(w)
        self.c1 = float(c1)
        self.c2 = float(c2)
        self.vfa_weight = float(vfa_weight)
        
        self.cov_eval = CoverageEvaluator(self.width, self.height, resolution=2.0)
        self.or_eval = OverlapEvaluator(self.cov_eval)
        self.hole_eval = HoleDetector(self.cov_eval)
        self.voronoi_analyzer = VoronoiAnalyzer(self.width, self.height)
        self.vfa_optimizer = VirtualForceOptimizer(
            field_width=self.width,
            field_height=self.height,
            sensing_radius=self.sensing_radius,
            w_attraction=0.6,
            w_repulsion=0.9,
            max_displacement=2.8
        )
        
    def evaluate_multi_objectives(
        self,
        coords: np.ndarray,
        initial_coords: np.ndarray,
        initial_energies: np.ndarray
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Evaluates the 5-objective vector for Pareto optimization:
        1. Coverage Ratio (CR %) -> Maximize
        2. -Overlap Ratio (OR %) -> Maximize (minimize overlap)
        3. -Hole Ratio (HR %)    -> Maximize (minimize holes)
        4. Residual Energy Factor -> Maximize
        5. -Total Movement Cost  -> Maximize (minimize displacement)
        """
        cov_ratio, count_mat = self.cov_eval.evaluate_coverage(coords, self.sensing_radius)
        or_cov, or_tot, n_red, mult = self.or_eval.evaluate_overlap(count_mat)
        hole_ratio, _, _ = self.hole_eval.evaluate_holes(count_mat)
        
        # Severe overlap penalty (k >= 3 points)
        severe_redundant_mask = count_mat > 2
        severe_overlap_ratio = (np.count_nonzero(severe_redundant_mask) / count_mat.size) * 100.0
        
        displacements = np.hypot(coords[:, 0] - initial_coords[:, 0], coords[:, 1] - initial_coords[:, 1])
        energy_spent = displacements * self.relocation_cost
        residual_energies = np.maximum(0.0, initial_energies - energy_spent)
        avg_residual_energy_ratio = np.mean(residual_energies / (initial_energies + 1e-6))
        total_movement = float(np.sum(displacements))
        
        # Composite overlap objective penalizing both total duplicate area and severe 3x+ clustering
        effective_overlap_score = (or_cov * 100.0) + (0.5 * severe_overlap_ratio)
        
        objs = np.array([
            cov_ratio,
            -effective_overlap_score,
            -hole_ratio,
            avg_residual_energy_ratio * 100.0,
            -total_movement
        ], dtype=np.float64)
        
        return objs, residual_energies

    def optimize(
        self,
        network: WSNNetwork,
        max_iterations: int = 50
    ) -> Tuple[np.ndarray, List[Dict[str, float]], ParetoArchive]:
        """
        Executes EA-VVF-MOPSO optimization.
        """
        n_sensors = network.num_sensors
        dim = n_sensors * 2
        initial_coords = network.get_positions_array()
        initial_energies = np.array([n.initial_energy for n in network.nodes])
        
        lb = np.zeros(dim); lb[0::2] = 2.0; lb[1::2] = 2.0
        ub = np.zeros(dim); ub[0::2] = self.width - 2.0; ub[1::2] = self.height - 2.0
        v_max = (ub - lb) * 0.08
        
        positions = np.zeros((self.num_particles, dim))
        velocities = np.random.uniform(-v_max, v_max, (self.num_particles, dim))
        
        # Swarm seeding:
        # Particle 0: Initial deployment
        positions[0] = initial_coords.flatten()
        
        # Particle 1: VFA-guided seed
        vfa_coords, _ = self.vfa_optimizer.optimize(network, max_iterations=20)
        positions[1] = vfa_coords.flatten()
        
        # Particle 2: Voronoi-guided seed
        vor_cells = self.voronoi_analyzer.compute_bounded_voronoi(initial_coords)
        vor_coords = np.copy(initial_coords)
        for cell in vor_cells:
            node_id = cell['node_id']
            if node_id < len(vor_coords):
                vor_coords[node_id] = 0.5 * vor_coords[node_id] + 0.5 * np.array(cell['centroid'])
        positions[2] = vor_coords.flatten()
        
        # Remaining particles: perturbed variants around good candidates
        for p in range(3, self.num_particles):
            base = vfa_coords if p % 2 == 0 else initial_coords
            positions[p] = (base + np.random.normal(0, 4.0, (n_sensors, 2))).flatten()
            positions[p] = np.clip(positions[p], lb, ub)
            
        pbest_pos = np.copy(positions)
        pbest_objs = np.zeros((self.num_particles, 5))
        
        for p in range(self.num_particles):
            coords = positions[p].reshape(-1, 2)
            objs, _ = self.evaluate_multi_objectives(coords, initial_coords, initial_energies)
            pbest_objs[p] = objs
            self.archive.update(positions[p], objs)
            
        history = []
        
        for it in range(max_iterations):
            w_curr = self.w * (1.0 - 0.5 * (it / max_iterations))
            
            for p in range(self.num_particles):
                gbest_pos = self.archive.select_leader()
                if gbest_pos is None:
                    gbest_pos = pbest_pos[p]
                    
                r1 = np.random.rand(dim)
                r2 = np.random.rand(dim)
                
                # 1. Swarm exploration velocity
                velocities[p] = (
                    w_curr * velocities[p]
                    + self.c1 * r1 * (pbest_pos[p] - positions[p])
                    + self.c2 * r2 * (gbest_pos - positions[p])
                )
                
                # 2. Virtual Force local geometric adjustment
                coords = positions[p].reshape(-1, 2)
                _, count_mat = self.cov_eval.evaluate_coverage(coords, self.sensing_radius)
                hole_coords = self.hole_eval.get_hole_coordinates(count_mat)
                vfa_forces = self.vfa_optimizer.calculate_forces(coords, hole_coords)
                
                # Combine velocities
                hybrid_velocity = velocities[p] + (self.vfa_weight * vfa_forces.flatten())
                hybrid_velocity = np.clip(hybrid_velocity, -v_max, v_max)
                velocities[p] = hybrid_velocity
                
                # 3. Position update with Energy-Aware Lock
                new_coords = coords + hybrid_velocity.reshape(-1, 2)
                
                # Energy Guard check
                displacements = np.hypot(new_coords[:, 0] - initial_coords[:, 0], new_coords[:, 1] - initial_coords[:, 1])
                curr_energies = np.maximum(0.0, initial_energies - displacements * self.relocation_cost)
                energy_ratios = curr_energies / (initial_energies + 1e-6)
                
                # Lock low battery nodes
                locked_mask = energy_ratios < self.energy_threshold
                new_coords[locked_mask] = coords[locked_mask]
                
                new_coords[:, 0] = np.clip(new_coords[:, 0], 2.0, self.width - 2.0)
                new_coords[:, 1] = np.clip(new_coords[:, 1], 2.0, self.height - 2.0)
                positions[p] = new_coords.flatten()
                
                # 4. Evaluate & Update Archive
                objs, _ = self.evaluate_multi_objectives(new_coords, initial_coords, initial_energies)
                if self.archive.dominates(objs, pbest_objs[p]):
                    pbest_objs[p] = objs
                    pbest_pos[p] = np.copy(positions[p])
                    
                self.archive.update(positions[p], objs)
                
            best_cov = max(m['objs'][0] for m in self.archive.solutions)
            best_or = max(m['objs'][1] for m in self.archive.solutions)
            history.append({
                'iteration': it + 1,
                'coverage': float(best_cov),
                'overlap': float(-best_or),
                'archive_size': len(self.archive.solutions)
            })
            
        # Select best balanced compromise solution from Pareto archive:
        # Prioritize high coverage (weight 0.45) + strong overlap suppression (weight 0.45) + low movement (weight 0.10)
        def balanced_score(sol):
            cr = sol['objs'][0]          # Coverage % (e.g. 99%)
            or_score = -sol['objs'][1]    # Composite overlap penalty
            mov = -sol['objs'][4]         # Displacement in meters
            score = (cr / 100.0) * 0.45 + (max(0.0, 150.0 - or_score) / 150.0) * 0.45 - (mov / 3000.0) * 0.10
            return score
            
        best_solution = max(self.archive.solutions, key=balanced_score)
        return best_solution['pos'].reshape(-1, 2), history, self.archive
