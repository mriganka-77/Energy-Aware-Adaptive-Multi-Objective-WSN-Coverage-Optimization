"""
Sensor Node Data Model.
Represents an individual physical sensor in the WSN with spatial coordinates,
sensing/communication radius, energy state, and relocation mechanics.
"""

import math
from typing import Tuple


class SensorNode:
    """Represents a single wireless sensor node."""
    
    def __init__(
        self,
        node_id: int,
        x: float,
        y: float,
        sensing_radius: float = 15.0,
        communication_radius: float = 30.0,
        initial_energy: float = 0.5,
    ):
        self.node_id = node_id
        self.x = float(x)
        self.y = float(y)
        self.initial_x = float(x)
        self.initial_y = float(y)
        self.sensing_radius = float(sensing_radius)
        self.communication_radius = float(communication_radius)
        self.initial_energy = float(initial_energy)
        self.residual_energy = float(initial_energy)
        self.is_alive = True
        self.is_cluster_head = False
        self.cluster_id = -1
        
    @property
    def position(self) -> Tuple[float, float]:
        """Returns the current (x, y) coordinates."""
        return (self.x, self.y)
    
    @property
    def initial_position(self) -> Tuple[float, float]:
        """Returns the initial deployment (x, y) coordinates."""
        return (self.initial_x, self.initial_y)
    
    @property
    def total_displacement(self) -> float:
        """Calculates total physical Euclidean distance moved from initial position."""
        return math.sqrt((self.x - self.initial_x)**2 + (self.y - self.initial_y)**2)
    
    @property
    def energy_ratio(self) -> float:
        """Returns residual energy as a fraction of initial energy (0.0 to 1.0)."""
        if self.initial_energy <= 0:
            return 0.0
        return max(0.0, self.residual_energy / self.initial_energy)
    
    def distance_to(self, target_x: float, target_y: float) -> float:
        """Calculates Euclidean distance to a target point."""
        return math.sqrt((self.x - target_x)**2 + (self.y - target_y)**2)
    
    def distance_to_node(self, other: "SensorNode") -> float:
        """Calculates Euclidean distance to another sensor node."""
        return self.distance_to(other.x, other.y)
    
    def can_sense(self, target_x: float, target_y: float) -> bool:
        """Determines if a target point falls within the binary disk sensing radius."""
        return self.distance_to(target_x, target_y) <= self.sensing_radius
    
    def can_communicate_with(self, other: "SensorNode") -> bool:
        """Determines if another sensor node is within communication radius Rc."""
        return self.distance_to_node(other) <= self.communication_radius
    
    def move_by(self, dx: float, dy: float, field_width: float, field_height: float, energy_cost_per_meter: float = 0.005) -> float:
        """
        Moves the sensor by displacement (dx, dy), clamping to field boundaries.
        Subtracts physical movement energy from residual energy.
        Returns the actual distance moved.
        """
        if not self.is_alive or self.residual_energy <= 0:
            return 0.0
        
        new_x = max(0.0, min(field_width, self.x + dx))
        new_y = max(0.0, min(field_height, self.y + dy))
        
        actual_distance = math.sqrt((new_x - self.x)**2 + (new_y - self.y)**2)
        energy_spent = actual_distance * energy_cost_per_meter
        
        if self.residual_energy >= energy_spent:
            self.residual_energy -= energy_spent
            self.x = new_x
            self.y = new_y
        else:
            # Move only as far as remaining energy allows
            fraction = self.residual_energy / energy_spent if energy_spent > 0 else 0
            self.x = self.x + (new_x - self.x) * fraction
            self.y = self.y + (new_y - self.y) * fraction
            actual_distance *= fraction
            self.residual_energy = 0.0
            self.is_alive = False
            
        return actual_distance
    
    def consume_energy(self, amount: float) -> bool:
        """
        Deducts energy for sensing, packet transmission, or reception.
        Returns True if node is still alive, False if battery is fully depleted.
        """
        self.residual_energy = max(0.0, self.residual_energy - amount)
        if self.residual_energy <= 0:
            self.is_alive = False
        return self.is_alive
    
    def reset(self):
        """Resets node position and energy back to initial state."""
        self.x = self.initial_x
        self.y = self.initial_y
        self.residual_energy = self.initial_energy
        self.is_alive = True
        self.is_cluster_head = False
        self.cluster_id = -1

    def __repr__(self) -> str:
        return f"SensorNode(id={self.node_id}, pos=({self.x:.2f}, {self.y:.2f}), E_res={self.residual_energy:.4f}J, alive={self.is_alive})"
