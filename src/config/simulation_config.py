"""
Configuration module for Wireless Sensor Network (WSN) Simulation.
Defines all tunable parameters for field size, sensor specifications,
optimization parameters, and evaluation metrics.
"""

from dataclasses import dataclass, field
from typing import Tuple, Optional


@dataclass
class NetworkConfig:
    """Configuration parameters for the physical sensing field and sensors."""
    field_width: float = 100.0          # Field width in meters
    field_height: float = 100.0        # Field height in meters
    num_sensors: int = 50              # Number of sensor nodes (N)
    sensing_radius: float = 15.0       # Sensing radius Rs in meters
    communication_radius: float = 30.0 # Communication radius Rc in meters
    initial_energy: float = 0.5        # Initial energy E0 in Joules
    sink_position: Tuple[float, float] = (50.0, 100.0) # Base Station coordinates (x, y)
    grid_resolution: float = 1.0       # Grid discretization step in meters (e.g. 1.0m)
    random_seed: Optional[int] = 42    # Random seed for reproducible deployments


@dataclass
class OptimizationConfig:
    """Hyperparameters for MOPSO, Voronoi, VFA, and Energy Controller."""
    # MOPSO parameters
    num_particles: int = 30            # Swarm size (population)
    max_iterations: int = 100          # Maximum optimization iterations
    inertia_weight: float = 0.729      # Inertia weight w
    c1: float = 1.49445                # Cognitive acceleration coefficient (personal best)
    c2: float = 1.49445                # Social acceleration coefficient (global best)
    archive_size: int = 50             # External Pareto archive capacity
    
    # Virtual Force parameters
    w_attraction: float = 0.4          # Attractive force weight to holes
    w_repulsion: float = 0.6           # Repulsive force weight between overlapping nodes
    w_boundary: float = 0.8            # Boundary repulsion weight
    max_displacement: float = 2.0      # Maximum movement step D_max per iteration in meters
    
    # Energy Controller
    energy_threshold: float = 0.3      # Low-battery threshold (30% of E0) to lock node movement
    relocation_energy_cost: float = 0.005 # Energy cost in Joules per meter of physical movement
    
    # Scalarized Fitness Weights (starting reference values)
    w_coverage: float = 0.35           # w_C
    w_overlap: float = 0.20            # w_O
    w_holes: float = 0.15              # w_H
    w_energy: float = 0.15             # w_E
    w_connectivity: float = 0.10       # w_K
    w_movement: float = 0.05           # w_M


@dataclass
class RoutingConfig:
    """First-Order Radio Model parameters for Hybrid LEACH–PEGASIS routing."""
    e_elec: float = 50e-9              # Energy dissipation to run electronics (50 nJ/bit)
    e_fs: float = 10e-12               # Free space transmitter amp (10 pJ/bit/m^2)
    e_mp: float = 0.0013e-12           # Multipath transmitter amp (0.0013 pJ/bit/m^4)
    e_da: float = 5e-9                 # Data aggregation energy (5 nJ/bit/signal)
    packet_size: int = 4000            # Data packet size in bits
    ctrl_packet_size: int = 200        # Control packet size in bits
    leach_cluster_prob: float = 0.05   # Desired percentage of Cluster Heads (P = 5%)
    max_rounds: int = 2000             # Maximum simulation rounds for routing
