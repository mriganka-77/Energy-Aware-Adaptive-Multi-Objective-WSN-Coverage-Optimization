"""
Genetic Algorithm (GA) for WSN Coverage Optimization.
Encodes sensor deployments as real-valued chromosomes, applying tournament selection,
blend crossover (BLX-alpha), and Gaussian mutation.
"""

from typing import Tuple, List
import numpy as np

from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator


class GeneticAlgorithm:
    """Genetic Algorithm for spatial sensor placement optimization."""
    
    def __init__(
        self,
        field_width: float = 100.0,
        field_height: float = 100.0,
        sensing_radius: float = 15.0,
        pop_size: int = 30,
        crossover_rate: float = 0.8,
        mutation_rate: float = 0.15,
        mutation_scale: float = 3.0
    ):
        self.width = float(field_width)
        self.height = float(field_height)
        self.sensing_radius = float(sensing_radius)
        self.pop_size = int(pop_size)
        self.cx_rate = float(crossover_rate)
        self.mut_rate = float(mutation_rate)
        self.mut_scale = float(mutation_scale)
        
        self.evaluator = CoverageEvaluator(self.width, self.height, resolution=2.0)
        
    def optimize(
        self,
        network: WSNNetwork,
        max_generations: int = 50
    ) -> Tuple[np.ndarray, List[float]]:
        """
        Runs Genetic Algorithm optimization.
        
        Returns:
            (best_positions, fitness_history)
        """
        n_sensors = network.num_sensors
        dim = n_sensors * 2
        
        # Initialize population
        population = np.zeros((self.pop_size, dim))
        population[0] = network.get_positions_array().flatten()
        for p in range(1, self.pop_size):
            population[p, 0::2] = np.random.uniform(0, self.width, n_sensors)
            population[p, 1::2] = np.random.uniform(0, self.height, n_sensors)
            
        fitness = np.zeros(self.pop_size)
        for p in range(self.pop_size):
            coords = population[p].reshape(-1, 2)
            cov, _ = self.evaluator.evaluate_coverage(coords, self.sensing_radius)
            fitness[p] = cov
            
        best_idx = int(np.argmax(fitness))
        best_chrom = np.copy(population[best_idx])
        best_val = fitness[best_idx]
        history = [best_val]
        
        for gen in range(max_generations):
            new_pop = []
            # Elitism: retain best solution
            new_pop.append(np.copy(best_chrom))
            
            while len(new_pop) < self.pop_size:
                # Tournament Selection (size = 3)
                t1 = np.random.choice(self.pop_size, 3, replace=False)
                p1_idx = t1[np.argmax(fitness[t1])]
                t2 = np.random.choice(self.pop_size, 3, replace=False)
                p2_idx = t2[np.argmax(fitness[t2])]
                
                p1 = population[p1_idx]
                p2 = population[p2_idx]
                
                # Crossover (BLX-alpha / arithmetic)
                if np.random.rand() < self.cx_rate:
                    alpha = 0.5
                    c1 = alpha * p1 + (1 - alpha) * p2
                    c2 = (1 - alpha) * p1 + alpha * p2
                else:
                    c1, c2 = np.copy(p1), np.copy(p2)
                    
                # Mutation (Gaussian perturbation)
                for child in [c1, c2]:
                    if len(new_pop) < self.pop_size:
                        mut_mask = np.random.rand(dim) < self.mut_rate
                        child += mut_mask * np.random.normal(0, self.mut_scale, dim)
                        child[0::2] = np.clip(child[0::2], 0, self.width)
                        child[1::2] = np.clip(child[1::2], 0, self.height)
                        new_pop.append(child)
                        
            population = np.array(new_pop)
            for p in range(self.pop_size):
                coords = population[p].reshape(-1, 2)
                cov, _ = self.evaluator.evaluate_coverage(coords, self.sensing_radius)
                fitness[p] = cov
                
            best_idx = int(np.argmax(fitness))
            if fitness[best_idx] > best_val:
                best_val = fitness[best_idx]
                best_chrom = np.copy(population[best_idx])
                
            history.append(best_val)
            
        return best_chrom.reshape(-1, 2), history
