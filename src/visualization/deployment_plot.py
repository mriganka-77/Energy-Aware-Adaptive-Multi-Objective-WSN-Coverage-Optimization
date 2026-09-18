"""
2D WSN Sensor Deployment Visualizer.
Generates publication-ready 2D plots showing node coordinates, circular sensing disks,
inter-sensor communication links, and Base Station locations.
"""

from typing import Optional, List
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

from src.models.network import WSNNetwork
from src.models.sensor import SensorNode


class DeploymentPlotter:
    """Generates 2D spatial deployment plots for WSN topologies."""
    
    def __init__(self, field_width: float = 100.0, field_height: float = 100.0):
        self.width = field_width
        self.height = field_height
        
    def plot_deployment(
        self,
        network: WSNNetwork,
        title: str = "WSN Sensor Deployment",
        show_sensing_disks: bool = True,
        show_comm_links: bool = True,
        save_path: Optional[str] = None
    ) -> plt.Figure:
        """
        Plots the 2D network layout with optional sensing disks and communication links.
        """
        fig, ax = plt.subplots(figsize=(8, 8), dpi=300)
        ax.set_xlim(-2, self.width + 2)
        ax.set_ylim(-2, self.height + 2)
        ax.set_aspect('equal')
        
        # Bounding field boundary box
        field_rect = patches.Rectangle(
            (0, 0), self.width, self.height,
            linewidth=1.5, edgecolor='#1E293B', facecolor='#F8FAFC', zorder=1
        )
        ax.add_patch(field_rect)
        
        alive_nodes = network.get_alive_nodes()
        coords = np.array([[n.x, n.y] for n in alive_nodes])
        n_alive = len(alive_nodes)
        
        # Communication links
        if show_comm_links and n_alive > 1:
            for i in range(n_alive):
                for j in range(i + 1, n_alive):
                    if alive_nodes[i].can_communicate_with(alive_nodes[j]):
                        ax.plot(
                            [alive_nodes[i].x, alive_nodes[j].x],
                            [alive_nodes[i].y, alive_nodes[j].y],
                            color='#94A3B8', linestyle='--', linewidth=0.8, alpha=0.5, zorder=2
                        )
                        
        # Sensing disks
        if show_sensing_disks:
            for node in alive_nodes:
                disk = patches.Circle(
                    (node.x, node.y), node.sensing_radius,
                    edgecolor='#0284C7', facecolor='#38BDF8', alpha=0.18,
                    linewidth=1.0, zorder=3
                )
                ax.add_patch(disk)
                
        # Sensor nodes (dots)
        if n_alive > 0:
            ax.scatter(
                coords[:, 0], coords[:, 1],
                color='#0284C7', edgecolor='#0F172A', s=45, linewidth=1.2,
                zorder=4, label=f'Sensor Nodes (N={n_alive})'
            )
            
        # Base Station / Sink
        ax.scatter(
            [network.sink_x], [network.sink_y],
            color='#E11D48', edgecolor='#881337', s=130, marker='s',
            zorder=5, label=f'Base Station ({network.sink_x:.0f}, {network.sink_y:.0f})'
        )
        
        ax.set_title(title, fontsize=12, fontweight='bold', color='#0F172A', pad=12)
        ax.set_xlabel('X Coordinate (meters)', fontsize=10, color='#334155')
        ax.set_ylabel('Y Coordinate (meters)', fontsize=10, color='#334155')
        ax.grid(True, linestyle=':', color='#CBD5E1', alpha=0.7)
        ax.legend(loc='upper right', fontsize=8.5, framealpha=0.9)
        
        plt.tight_layout()
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            print(f"Saved deployment plot to {save_path}")
            
        return fig
