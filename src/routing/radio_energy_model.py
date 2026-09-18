"""
First-Order Radio Energy Model for WSN Routing Protocols.
Matches the exact physical parameters and energy dissipation formulas
used in LEACH, PEGASIS, and Hybrid LEACH–PEGASIS simulations.
"""

from dataclasses import dataclass
import numpy as np


@dataclass
class RadioEnergyModel:
    """Standard First-Order Radio Energy Model parameters."""
    e_elec: float = 50e-9              # Energy dissipation to run transceiver circuitry (50 nJ/bit)
    e_rx: float = 50e-9                # Energy to receive a bit (50 nJ/bit)
    e_fs: float = 50e-12               # Free-space amplifier energy (50 pJ/bit/m^2)
    e_mp: float = 0.0013e-11           # Multipath amplifier energy (0.0013 pJ/bit/m^4)
    e_da: float = 5e-9                 # Data aggregation energy (5 nJ/bit/signal)
    packet_size: int = 8000            # Standard sensory data packet size in bits (k)
    idle_energy_drain: float = 0.00005 # Baseline idle sensing/processing drain per round (Joules)
    sink_x: float = 50.0               # Base Station X coordinate
    sink_y: float = 150.0              # Base Station Y coordinate
    
    @property
    def d0(self) -> float:
        """Crossover threshold distance between free-space and multipath models."""
        return np.sqrt(self.e_fs / self.e_mp)
    
    def transmission_energy(self, distance: float, num_bits: int = 8000) -> float:
        """
        Calculates energy consumed to transmit num_bits over a given distance.
        E_Tx(k, d) = k * E_elec + k * E_fs * d^2 (if d <= d0)
                   = k * E_elec + k * E_mp * d^4 (if d > d0)
        """
        if distance <= self.d0:
            return num_bits * self.e_elec + num_bits * self.e_fs * (distance**2)
        else:
            return num_bits * self.e_elec + num_bits * self.e_mp * (distance**4)
            
    def reception_energy(self, num_bits: int = 8000) -> float:
        """Calculates energy consumed to receive num_bits: E_Rx(k) = k * E_rx."""
        return num_bits * self.e_rx
        
    def aggregation_energy(self, num_bits: int = 8000) -> float:
        """Calculates energy consumed to aggregate signals: E_DA(k) = k * E_da."""
        return num_bits * self.e_da
