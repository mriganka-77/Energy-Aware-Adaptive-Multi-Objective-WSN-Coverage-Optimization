"""
Overlap and Redundancy Metric Calculator.
Evaluates redundant coverage area, overlap ratio, and average coverage multiplicity.
"""

from typing import Tuple, Union, List
import numpy as np

from src.coverage.coverage_model import CoverageEvaluator
from src.models.sensor import SensorNode
from src.models.network import WSNNetwork


class OverlapEvaluator:
    """Computes sensing overlap and coverage multiplicity metrics."""
    
    def __init__(self, coverage_evaluator: CoverageEvaluator):
        self.coverage_evaluator = coverage_evaluator
        
    def evaluate_overlap(
        self,
        count_matrix: np.ndarray
    ) -> Tuple[float, float, int, int]:
        """
        Calculates overlap metrics from a precomputed coverage count matrix.
        
        Args:
            count_matrix: 2D integer array of coverage counts per grid point.
            
        Returns:
            (overlap_ratio_covered, overlap_ratio_total, num_redundant_points, average_multiplicity)
            - overlap_ratio_covered: N_redundant / N_covered (fraction of covered area that is duplicated)
            - overlap_ratio_total: N_redundant / N_total * 100 (percentage of whole field with redundant coverage)
            - num_redundant_points: raw count of grid points where count >= 2
            - average_multiplicity: mean number of sensors covering covered points (sum(k) / N_covered)
        """
        covered_mask = count_matrix > 0
        redundant_mask = count_matrix > 1
        
        num_covered_points = int(np.count_nonzero(covered_mask))
        num_redundant_points = int(np.count_nonzero(redundant_mask))
        num_total_points = count_matrix.size
        
        if num_covered_points > 0:
            overlap_ratio_covered = float(num_redundant_points) / float(num_covered_points)
            average_multiplicity = float(np.sum(count_matrix[covered_mask])) / float(num_covered_points)
        else:
            overlap_ratio_covered = 0.0
            average_multiplicity = 0.0
            
        overlap_ratio_total = (float(num_redundant_points) / float(num_total_points)) * 100.0
        
        return overlap_ratio_covered, overlap_ratio_total, num_redundant_points, average_multiplicity

    def compute_overlap(
        self,
        node_positions: Union[np.ndarray, List[SensorNode], WSNNetwork],
        sensing_radius: float = 15.0
    ) -> Tuple[float, float, int, float, np.ndarray]:
        """
        Directly evaluates overlap metrics from sensor positions.
        
        Returns:
            (overlap_ratio_covered, overlap_ratio_total, num_redundant_points, average_multiplicity, count_matrix)
        """
        count_matrix = self.coverage_evaluator.compute_coverage_matrix(node_positions, sensing_radius)
        or_cov, or_tot, n_red, mult = self.evaluate_overlap(count_matrix)
        return or_cov, or_tot, n_red, mult, count_matrix
