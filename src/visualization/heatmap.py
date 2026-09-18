"""
Coverage, Overlap, and Voronoi Density Heatmap Visualizer.
Plots 2D continuous color-mapped grids showing coverage multiplicity,
redundant overlap concentrations, and Voronoi territory partitioning.
"""

from typing import Optional, List, Dict
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.colors import ListedColormap, BoundaryNorm

from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator


class HeatmapPlotter:
    """Generates 2D heatmaps and Voronoi overlay plots."""
    
    def __init__(self, coverage_evaluator: CoverageEvaluator):
        self.evaluator = coverage_evaluator
        
    def plot_coverage_heatmap(
        self,
        count_matrix: np.ndarray,
        network: Optional[WSNNetwork] = None,
        title: str = "WSN Sensing Coverage Multiplicity Heatmap",
        save_path: Optional[str] = None
    ) -> plt.Figure:
        """
        Plots a discrete color-mapped heatmap of coverage counts:
        - 0 = Dark Navy (Hole / Uncovered)
        - 1 = Cyan / Emerald (Unique Ideal Coverage)
        - 2 = Amber / Orange (2x Overlap)
        - 3+ = Crimson / Red (High Redundancy)
        """
        fig, ax = plt.subplots(figsize=(8.5, 7.5), dpi=300)
        
        # Color palette definition
        cmap_colors = ['#0F172A', '#0284C7', '#34D399', '#FBBF24', '#F97316', '#EF4444', '#991B1B']
        cmap = ListedColormap(cmap_colors[:max(4, int(count_matrix.max()) + 1)])
        
        im = ax.imshow(
            count_matrix,
            origin='lower',
            extent=[0, self.evaluator.width, 0, self.evaluator.height],
            cmap=cmap,
            interpolation='nearest'
        )
        
        # Sensor locations overlay
        if network is not None:
            alive_nodes = network.get_alive_nodes()
            coords = np.array([[n.x, n.y] for n in alive_nodes])
            if len(coords) > 0:
                ax.scatter(
                    coords[:, 0], coords[:, 1],
                    color='#FFFFFF', edgecolor='#000000', s=35, linewidth=1.2,
                    label='Sensor Nodes', zorder=4
                )
            ax.scatter(
                [network.sink_x], [network.sink_y],
                color='#F43F5E', edgecolor='#FFFFFF', s=110, marker='s',
                label='Base Station', zorder=5
            )
            ax.legend(loc='upper right', fontsize=8.5, facecolor='#1E293B', labelcolor='#FFFFFF')
            
        cbar = plt.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label('Coverage Count (# Sensors covering point)', fontsize=9.5)
        
        ax.set_title(title, fontsize=11.5, fontweight='bold', pad=12)
        ax.set_xlabel('X Coordinate (meters)', fontsize=10)
        ax.set_ylabel('Y Coordinate (meters)', fontsize=10)
        
        plt.tight_layout()
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            print(f"Saved heatmap to {save_path}")
            
        return fig

    def plot_voronoi_diagram(
        self,
        voronoi_cells: List[Dict],
        network: WSNNetwork,
        title: str = "Voronoi Territory Partitioning & Anomaly Detection",
        save_path: Optional[str] = None
    ) -> plt.Figure:
        """
        Plots bounded Voronoi cells with color-coded area density.
        """
        fig, ax = plt.subplots(figsize=(8, 8), dpi=300)
        ax.set_xlim(-2, self.evaluator.width + 2)
        ax.set_ylim(-2, self.evaluator.height + 2)
        ax.set_aspect('equal')
        
        # Draw cells
        for cell in voronoi_cells:
            verts = cell['polygon_vertices']
            if len(verts) >= 3:
                poly = patches.Polygon(
                    verts, closed=True,
                    facecolor='#F1F5F9', edgecolor='#64748B',
                    linewidth=1.0, alpha=0.7, zorder=2
                )
                ax.add_patch(poly)
                
        # Draw sensing disks lightly
        for node in network.get_alive_nodes():
            disk = patches.Circle(
                (node.x, node.y), node.sensing_radius,
                edgecolor='#0284C7', facecolor='#0284C7', alpha=0.08,
                linewidth=0.8, zorder=3
            )
            ax.add_patch(disk)
            
        # Draw nodes
        coords = network.get_positions_array()
        ax.scatter(coords[:, 0], coords[:, 1], color='#0284C7', edgecolor='#0F172A', s=40, zorder=4, label='Sensor Nodes')
        ax.scatter([network.sink_x], [network.sink_y], color='#E11D48', s=120, marker='s', zorder=5, label='Base Station')
        
        ax.set_title(title, fontsize=12, fontweight='bold', pad=12)
        ax.set_xlabel('X Coordinate (meters)', fontsize=10)
        ax.set_ylabel('Y Coordinate (meters)', fontsize=10)
        ax.legend(loc='upper right', fontsize=8.5)
        ax.grid(True, linestyle=':', alpha=0.6)
        
        plt.tight_layout()
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            print(f"Saved Voronoi diagram to {save_path}")
            
        return fig
