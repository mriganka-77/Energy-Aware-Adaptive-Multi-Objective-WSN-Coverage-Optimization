"""
Voronoi Diagram Geometric Analysis Module.
Generates bounded Voronoi cells from sensor coordinates, calculates cell areas,
and flags sparse regions (potential holes) vs. overcrowded regions (redundancy).
Uses pure NumPy/SciPy implementation with Sutherland-Hodgman polygon clipping.
"""

from typing import List, Dict, Tuple, Union, Optional
import numpy as np
from scipy.spatial import Voronoi

from src.models.sensor import SensorNode
from src.models.network import WSNNetwork


def clip_polygon_to_box(vertices: np.ndarray, width: float, height: float) -> np.ndarray:
    """
    Clips a 2D convex/simple polygon to a bounding box [0, width] x [0, height]
    using the Sutherland-Hodgman polygon clipping algorithm.
    """
    if len(vertices) < 3:
        return np.array([])
        
    def clip_edge(poly_verts, edge_idx):
        # edge_idx: 0: x>=0, 1: x<=width, 2: y>=0, 3: y<=height
        out = []
        if len(poly_verts) == 0:
            return out
            
        def is_inside(p):
            if edge_idx == 0: return p[0] >= 0
            if edge_idx == 1: return p[0] <= width
            if edge_idx == 2: return p[1] >= 0
            if edge_idx == 3: return p[1] <= height
            return True
            
        def intersection(p1, p2):
            x1, y1 = p1
            x2, y2 = p2
            dx = x2 - x1
            dy = y2 - y1
            if edge_idx == 0: # x = 0
                t = (0 - x1) / dx if dx != 0 else 0
                return [0.0, y1 + t * dy]
            elif edge_idx == 1: # x = width
                t = (width - x1) / dx if dx != 0 else 0
                return [width, y1 + t * dy]
            elif edge_idx == 2: # y = 0
                t = (0 - y1) / dy if dy != 0 else 0
                return [x1 + t * dx, 0.0]
            elif edge_idx == 3: # y = height
                t = (height - y1) / dy if dy != 0 else 0
                return [x1 + t * dx, height]
            return p1

        p_prev = poly_verts[-1]
        for p_curr in poly_verts:
            if is_inside(p_curr):
                if is_inside(p_prev):
                    out.append(p_curr)
                else:
                    out.append(intersection(p_prev, p_curr))
                    out.append(p_curr)
            elif is_inside(p_prev):
                out.append(intersection(p_prev, p_curr))
            p_prev = p_curr
        return out

    poly = vertices.tolist()
    for edge in range(4):
        poly = clip_edge(poly, edge)
        if len(poly) < 3:
            return np.array([])
            
    return np.array(poly)


def polygon_area_and_centroid(vertices: np.ndarray) -> Tuple[float, Tuple[float, float]]:
    """Calculates area and centroid of a 2D polygon using the Shoelace formula."""
    if len(vertices) < 3:
        return 0.0, (0.0, 0.0)
    x = vertices[:, 0]
    y = vertices[:, 1]
    # Shoelace formula
    cross = x[:-1] * y[1:] - x[1:] * y[:-1] + (x[-1] * y[0] - x[0] * y[-1])
    area = 0.5 * np.abs(np.sum(cross))
    
    if area < 1e-7:
        return 0.0, (float(np.mean(x)), float(np.mean(y)))
        
    # Centroid formula
    cx = np.sum((x[:-1] + x[1:]) * (x[:-1] * y[1:] - x[1:] * y[:-1])) + (x[-1] + x[0]) * (x[-1] * y[0] - x[0] * y[-1])
    cy = np.sum((y[:-1] + y[1:]) * (y[:-1] * y[1:] - x[1:] * y[:-1])) + (y[-1] + y[0]) * (x[-1] * y[0] - x[0] * y[-1])
    cx = cx / (6.0 * area)
    cy = cy / (6.0 * area)
    return float(area), (float(cx), float(cy))


class VoronoiAnalyzer:
    """Computes bounded Voronoi tessellations and geometric density metrics."""
    
    def __init__(self, field_width: float = 100.0, field_height: float = 100.0):
        self.width = float(field_width)
        self.height = float(field_height)
        
    def compute_bounded_voronoi(
        self,
        node_positions: Union[np.ndarray, List[SensorNode], WSNNetwork]
    ) -> List[Dict[str, Union[int, np.ndarray, float, Tuple[float, float], bool]]]:
        """
        Computes bounded Voronoi polygon cells for each sensor node within the field.
        Uses mirror reflections across borders to cleanly bound all edge cells.
        """
        if isinstance(node_positions, WSNNetwork):
            coords = node_positions.get_positions_array()
        elif isinstance(node_positions, list):
            coords = np.array([[n.x, n.y] for n in node_positions], dtype=np.float64)
        else:
            coords = np.asarray(node_positions, dtype=np.float64)
            
        n_nodes = len(coords)
        if n_nodes < 3:
            return []
            
        # Create mirror reflection ghost points across 4 boundaries
        left_mirror = np.copy(coords); left_mirror[:, 0] = -left_mirror[:, 0]
        right_mirror = np.copy(coords); right_mirror[:, 0] = 2 * self.width - right_mirror[:, 0]
        bottom_mirror = np.copy(coords); bottom_mirror[:, 1] = -bottom_mirror[:, 1]
        top_mirror = np.copy(coords); top_mirror[:, 1] = 2 * self.height - top_mirror[:, 1]
        
        all_points = np.vstack([coords, left_mirror, right_mirror, bottom_mirror, top_mirror])
        vor = Voronoi(all_points)
        
        results = []
        for i in range(n_nodes):
            region_idx = vor.point_region[i]
            region_verts_indices = vor.regions[region_idx]
            
            if not region_verts_indices or -1 in region_verts_indices:
                raw_verts = np.array([[0, 0], [self.width, 0], [self.width, self.height], [0, self.height]])
            else:
                raw_verts = vor.vertices[region_verts_indices]
                
            clipped_verts = clip_polygon_to_box(raw_verts, self.width, self.height)
            if len(clipped_verts) >= 3:
                area, centroid = polygon_area_and_centroid(clipped_verts)
                # Check if touching border
                is_boundary = np.any(np.isclose(clipped_verts[:, 0], 0.0) |
                                     np.isclose(clipped_verts[:, 0], self.width) |
                                     np.isclose(clipped_verts[:, 1], 0.0) |
                                     np.isclose(clipped_verts[:, 1], self.height))
            else:
                area = 0.0
                centroid = (float(coords[i, 0]), float(coords[i, 1]))
                clipped_verts = np.array([])
                is_boundary = True
                
            results.append({
                'node_id': i,
                'generator_pos': (float(coords[i, 0]), float(coords[i, 1])),
                'polygon_vertices': clipped_verts,
                'cell_area': area,
                'centroid': centroid,
                'is_boundary': bool(is_boundary)
            })
            
        return results

    def detect_density_anomalies(
        self,
        voronoi_cells: List[Dict],
        sensing_radius: float = 15.0
    ) -> Tuple[List[int], List[int]]:
        """
        Flags sensors with anomalous cell sizes:
        - Sparse / Hole candidates: cell_area > 1.3 * pi * Rs^2
        - Redundant / Overcrowded candidates: cell_area < 0.6 * pi * Rs^2
        """
        ideal_sensing_area = np.pi * (sensing_radius**2)
        sparse_nodes = []
        redundant_nodes = []
        
        for cell in voronoi_cells:
            node_id = int(cell['node_id'])
            area = float(cell['cell_area'])
            
            if area > 1.3 * ideal_sensing_area:
                sparse_nodes.append(node_id)
            elif area < 0.6 * ideal_sensing_area:
                redundant_nodes.append(node_id)
                
        return sparse_nodes, redundant_nodes
