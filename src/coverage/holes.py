"""
Coverage Hole Detection and Metric Analysis.
Identifies uncovered regions (blind spots), calculates Hole Ratio (HR),
and extracts spatial coordinates of coverage hole clusters.
"""

from typing import Tuple, List, Union
import numpy as np

from src.coverage.coverage_model import CoverageEvaluator
from src.models.sensor import SensorNode
from src.models.network import WSNNetwork


class HoleDetector:
    """Detects and analyzes uncovered sensing holes across the field."""
    
    def __init__(self, coverage_evaluator: CoverageEvaluator):
        self.coverage_evaluator = coverage_evaluator
        
    def evaluate_holes(self, count_matrix: np.ndarray) -> Tuple[float, int, np.ndarray]:
        """
        Calculates coverage hole metrics from a precomputed coverage count matrix.
        
        Args:
            count_matrix: 2D integer array of coverage counts per grid point.
            
        Returns:
            (hole_ratio_percentage, num_uncovered_points, hole_mask)
            - hole_ratio_percentage: Nuncovered / Ntotal * 100
            - num_uncovered_points: count of grid points where count == 0
            - hole_mask: 2D boolean array where True indicates an uncovered hole point
        """
        hole_mask = (count_matrix == 0)
        num_uncovered_points = int(np.count_nonzero(hole_mask))
        num_total_points = count_matrix.size
        
        hole_ratio_percentage = (float(num_uncovered_points) / float(num_total_points)) * 100.0
        return hole_ratio_percentage, num_uncovered_points, hole_mask

    def get_hole_coordinates(self, count_matrix: np.ndarray) -> np.ndarray:
        """
        Returns (x, y) coordinates of all uncovered grid points.
        Useful for Virtual Force attraction targeting.
        """
        hole_mask = (count_matrix == 0)
        hole_x = self.coverage_evaluator.grid_x[hole_mask]
        hole_y = self.coverage_evaluator.grid_y[hole_mask]
        return np.column_stack([hole_x, hole_y])
