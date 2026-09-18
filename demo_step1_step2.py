"""
Verification & Demonstration Script for Step 1 & Step 2.
Tests WSN simulation foundation, sensor data models, vectorized coverage,
redundant overlap calculation, coverage hole detection, and Voronoi diagram analysis.
"""

import os
import time
import numpy as np

from src.config.simulation_config import NetworkConfig
from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator
from src.coverage.overlap import OverlapEvaluator
from src.coverage.holes import HoleDetector
from src.coverage.voronoi import VoronoiAnalyzer
from src.visualization.deployment_plot import DeploymentPlotter
from src.visualization.heatmap import HeatmapPlotter


def run_demonstration():
    print("=" * 70)
    print("🚀 WSN COVERAGE & OVERLAP FRAMEWORK — PHASE 1 & PHASE 2 VERIFICATION")
    print("=" * 70)
    
    # 1. Initialize Network Configuration
    config = NetworkConfig(
        field_width=100.0,
        field_height=100.0,
        num_sensors=50,
        sensing_radius=15.0,
        communication_radius=30.0,
        initial_energy=0.5,
        sink_position=(50.0, 100.0),
        grid_resolution=1.0,
        random_seed=42
    )
    
    print("\n[1] Network Setup:")
    print(f"  • Field Dimensions   : {config.field_width:.0f} x {config.field_height:.0f} meters")
    print(f"  • Sensor Nodes (N)   : {config.num_sensors}")
    print(f"  • Sensing Radius (Rs): {config.sensing_radius:.1f} m")
    print(f"  • Comm Radius (Rc)   : {config.communication_radius:.1f} m")
    print(f"  • Base Station (Sink): ({config.sink_position[0]:.0f}, {config.sink_position[1]:.0f})")
    print(f"  • Grid Resolution    : {config.grid_resolution:.1f} m ({int(config.field_width+1)}x{int(config.field_height+1)} = {(int(config.field_width+1))**2} points)")
    
    # 2. Deploy Network
    network = WSNNetwork(config)
    print(f"\n[2] Initial Random Deployment Generated (Seed = {config.random_seed}):")
    print(f"  • Deployed Sensors   : {len(network.nodes)} nodes")
    print(f"  • Alive Sensors      : {network.count_alive_nodes()}")
    print(f"  • Total Initial Energy: {network.get_total_residual_energy():.2f} Joules")
    
    # Check Connectivity
    connectivity = network.compute_connectivity_factor()
    print(f"  • Connectivity Factor: {connectivity * 100:.1f}% of nodes connected in largest cluster")

    # 3. Vectorized Coverage & Overlap Evaluation
    t0 = time.time()
    coverage_eval = CoverageEvaluator(config.field_width, config.field_height, config.grid_resolution)
    overlap_eval = OverlapEvaluator(coverage_eval)
    hole_eval = HoleDetector(coverage_eval)
    
    cov_ratio, count_matrix = coverage_eval.evaluate_coverage(network)
    or_cov, or_tot, n_redundant, multiplicity = overlap_eval.evaluate_overlap(count_matrix)
    hole_ratio, n_uncovered, hole_mask = hole_eval.evaluate_holes(count_matrix)
    eval_time = (time.time() - t0) * 1000.0
    
    print(f"\n[3] Scoring Engine Results (Computed in {eval_time:.2f} ms):")
    print(f"  • Coverage Ratio (CR)     : {cov_ratio:.2f}% (Total Monitored Area)")
    print(f"  • Coverage Hole Ratio (HR): {hole_ratio:.2f}% (Uncovered Blind Spots)")
    print(f"  • Redundant Overlap Ratio : {or_cov * 100:.2f}% of covered points are duplicated (>= 2 sensors)")
    print(f"  • Field Overlap Ratio     : {or_tot:.2f}% of entire field area")
    print(f"  • Average Multiplicity    : {multiplicity:.2f} sensors per covered point")
    print(f"  • Max Multiplicity Point  : {count_matrix.max()} overlapping sensors")
    
    # Verify Mathematical Invariant
    assert abs((cov_ratio + hole_ratio) - 100.0) < 1e-4, "Invariant Violation: Coverage% + Hole% must equal 100%!"
    print(f"  ✅ Mathematical Invariant Verified: CR ({cov_ratio:.2f}%) + HR ({hole_ratio:.2f}%) = 100.00%")

    # 4. Voronoi Analysis
    t0 = time.time()
    voronoi_analyzer = VoronoiAnalyzer(config.field_width, config.field_height)
    voronoi_cells = voronoi_analyzer.compute_bounded_voronoi(network)
    sparse_nodes, redundant_nodes = voronoi_analyzer.detect_density_anomalies(voronoi_cells, config.sensing_radius)
    vor_time = (time.time() - t0) * 1000.0
    
    print(f"\n[4] Voronoi Geometric Analysis (Computed in {vor_time:.2f} ms):")
    print(f"  • Bounded Cells Extracted : {len(voronoi_cells)} Voronoi polygons")
    print(f"  • Sparse / Hole Nodes     : {len(sparse_nodes)} nodes (IDs: {sparse_nodes[:6]}...)")
    print(f"  • Overcrowded / Redundant : {len(redundant_nodes)} nodes (IDs: {redundant_nodes[:6]}...)")

    # 5. Generate and Save Visualizations
    os.makedirs("results/plots", exist_ok=True)
    os.makedirs("results/raw", exist_ok=True)
    
    plotter = DeploymentPlotter(config.field_width, config.field_height)
    plotter.plot_deployment(
        network,
        title=f"Initial Random Deployment (N={config.num_sensors}, Rs={config.sensing_radius:.0f}m, CR={cov_ratio:.1f}%)",
        save_path="results/plots/initial_deployment.png"
    )
    
    heatmap_plotter = HeatmapPlotter(coverage_eval)
    heatmap_plotter.plot_coverage_heatmap(
        count_matrix,
        network=network,
        title=f"Coverage Multiplicity Heatmap (CR={cov_ratio:.1f}%, OR={or_cov*100:.1f}%, Holes={hole_ratio:.1f}%)",
        save_path="results/plots/coverage_heatmap.png"
    )
    
    heatmap_plotter.plot_voronoi_diagram(
        voronoi_cells,
        network=network,
        title=f"Bounded Voronoi Diagram & Density Anomaly Detection",
        save_path="results/plots/voronoi_tessellation.png"
    )
    
    print("\n[5] Generated Publication-Quality Visual Figures:")
    print("  📁 results/plots/initial_deployment.png")
    print("  📁 results/plots/coverage_heatmap.png")
    print("  📁 results/plots/voronoi_tessellation.png")
    print("\n" + "=" * 70)
    print("🎉 PHASE 1 & PHASE 2 TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    run_demonstration()
