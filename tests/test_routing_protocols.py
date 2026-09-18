"""
Two-Phase WSN Verification:
Phase 1: Sensor Deployment & EA-VVF-MOPSO Swarm Optimization.
Phase 2: Data Routing Simulation (LEACH vs. PEGASIS vs. HYBRID LEACH–PEGASIS).
Measures spatial coverage gains, overlap reduction, and downstream routing energy efficiency.
"""

import os
import sys
from pathlib import Path
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Ensure workspace root is in sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from src.config.simulation_config import NetworkConfig
from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator
from src.coverage.overlap import OverlapEvaluator
from src.coverage.holes import HoleDetector
from src.optimization.ea_vvf_mopso import EAVVFMOPSO
from src.routing.radio_energy_model import RadioEnergyModel
from src.routing.leach import LEACHSimulator
from src.routing.pegasis import PEGASISSimulator
from src.routing.hybrid_leach_pegasis import HybridLEACHPEGASISSimulator


def run_deployment_and_routing_pipeline():
    print("=" * 75)
    print("📡 WSN COMPLETE PIPELINE: PHASE 1 (DEPLOYMENT) ➡️ PHASE 2 (DATA ROUTING)")
    print("=" * 75)

    # -------------------------------------------------------------------------
    # PHASE 1: SENSOR DEPLOYMENT & EA-VVF-MOPSO OPTIMIZATION
    # -------------------------------------------------------------------------
    config = NetworkConfig(
        field_width=100.0,
        field_height=100.0,
        num_sensors=50,
        sensing_radius=15.0,
        communication_radius=30.0,
        initial_energy=0.5,
        random_seed=42
    )

    print("\n[PHASE 1: SENSOR DEPLOYMENT]")
    network = WSNNetwork(config)
    random_coords = network.get_positions_array()

    cov_eval = CoverageEvaluator(config.field_width, config.field_height, resolution=1.0)
    or_eval = OverlapEvaluator(cov_eval)
    hole_eval = HoleDetector(cov_eval)

    # Evaluate Random Deployment
    rand_cov, rand_cnt = cov_eval.evaluate_coverage(random_coords, config.sensing_radius)
    rand_or, _, _, rand_mult = or_eval.evaluate_overlap(rand_cnt)
    rand_hole, _, _ = hole_eval.evaluate_holes(rand_cnt)

    print(f"  • Initial Random Coverage : {rand_cov:.2f}% | Overlap: {rand_or*100:.2f}% | Holes: {rand_hole:.2f}%")

    print("\n[PHASE 1.5: OPTIMIZING TOPOLOGY WITH EA-VVF-MOPSO]")
    t0 = time.time()
    optimizer = EAVVFMOPSO(
        field_width=config.field_width,
        field_height=config.field_height,
        sensing_radius=config.sensing_radius,
        num_particles=25
    )
    optimized_coords, _, _ = optimizer.optimize(network, max_iterations=40)
    opt_time = (time.time() - t0)

    opt_cov, opt_cnt = cov_eval.evaluate_coverage(optimized_coords, config.sensing_radius)
    opt_or, _, _, opt_mult = or_eval.evaluate_overlap(opt_cnt)
    opt_hole, _, _ = hole_eval.evaluate_holes(opt_cnt)
    total_displacement = float(np.sum(np.hypot(optimized_coords[:, 0] - random_coords[:, 0], optimized_coords[:, 1] - random_coords[:, 1])))

    print(f"  • Optimization Runtime    : {opt_time:.2f} seconds")
    print(f"  • Optimized Coverage      : {opt_cov:.2f}% (Holes: {opt_hole:.2f}%)")
    print(f"  • Overlap Reduced To      : {opt_or*100:.2f}%")
    print(f"  • Total Node Displacement : {total_displacement:.2f} meters (Average: {total_displacement/config.num_sensors:.2f} m/node)")

    # -------------------------------------------------------------------------
    # PHASE 2: DATA ROUTING SIMULATION (1000 ROUNDS)
    # -------------------------------------------------------------------------
    print("\n" + "=" * 75)
    print("📡 [PHASE 2: DATA ROUTING EFFICIENCY SIMULATION (1000 ROUNDS)]")
    print("=" * 75)

    radio = RadioEnergyModel(sink_x=50.0, sink_y=150.0)
    max_rounds = 1000

    # Nodes initialized with residual battery accounting for physical relocation
    disp_cost_per_node = (total_displacement * 0.005) / config.num_sensors
    opt_nodes_e0 = max(0.10, 0.50 - disp_cost_per_node)

    opt_nodes_leach = [{"x": optimized_coords[i, 0], "y": optimized_coords[i, 1], "E": opt_nodes_e0} for i in range(len(optimized_coords))]
    opt_nodes_pegasis = [{"x": optimized_coords[i, 0], "y": optimized_coords[i, 1], "E": opt_nodes_e0} for i in range(len(optimized_coords))]
    opt_nodes_hybrid = [{"x": optimized_coords[i, 0], "y": optimized_coords[i, 1], "E": opt_nodes_e0} for i in range(len(optimized_coords))]

    # 1. LEACH Simulation
    print("\n[1] Executing LEACH Protocol on Optimized Topology...")
    leach_sim = LEACHSimulator(radio_model=radio, p_ch=0.1)
    l_alive, l_energy, l_fnd, l_hnd, l_lnd = leach_sim.run_simulation(opt_nodes_leach, max_rounds)
    print(f"  • LEACH First Node Death (FND) : Round {l_fnd}")
    print(f"  • LEACH Half Node Death (HND)  : Round {l_hnd}")
    print(f"  • LEACH Last Node Death (LND)  : Round {l_lnd}")

    # 2. PEGASIS Simulation
    print("\n[2] Executing PEGASIS Protocol on Optimized Topology...")
    pegasis_sim = PEGASISSimulator(radio_model=radio)
    p_alive, p_energy, p_fnd, p_hnd, p_lnd = pegasis_sim.run_simulation(opt_nodes_pegasis, max_rounds)
    print(f"  • PEGASIS First Node Death (FND): Round {p_fnd}")
    print(f"  • PEGASIS Half Node Death (HND) : Round {p_hnd}")
    print(f"  • PEGASIS Last Node Death (LND) : Round {p_lnd}")

    # 3. Hybrid LEACH–PEGASIS Simulation
    print("\n[3] Executing HYBRID LEACH–PEGASIS Protocol on Optimized Topology...")
    hybrid_sim = HybridLEACHPEGASISSimulator(radio_model=radio, ch_percentage=0.05, multihop_threshold=75.0, aggregation_factor=0.8)
    h_alive, h_energy, h_fnd, h_hnd, h_lnd = hybrid_sim.run_simulation(opt_nodes_hybrid, max_rounds)
    print(f"  • HYBRID First Node Death (FND): Round {h_fnd}")
    print(f"  • HYBRID Half Node Death (HND) : Round {h_hnd}")
    print(f"  • HYBRID Last Node Death (LND) : Round {h_lnd}")

    # -------------------------------------------------------------------------
    # EXPORT RESULTS & PLOTS
    # -------------------------------------------------------------------------
    os.makedirs("results/raw", exist_ok=True)
    os.makedirs("results/plots", exist_ok=True)

    df_results = pd.DataFrame({
        "Round": np.arange(1, max_rounds + 1),
        "LEACH_Alive": l_alive,
        "LEACH_Energy": l_energy,
        "PEGASIS_Alive": p_alive,
        "PEGASIS_Energy": p_energy,
        "HYBRID_Alive": h_alive,
        "HYBRID_Energy": h_energy,
    })
    df_results.to_csv("results/raw/routing_comparison_1000_rounds.csv", index=False)

    # Generate Publication Plots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5.5), dpi=300)

    # Plot 1: Lifetime
    ax1.plot(df_results["Round"], df_results["LEACH_Alive"], label='LEACH Protocol', color='#EF4444', linewidth=2.0)
    ax1.plot(df_results["Round"], df_results["PEGASIS_Alive"], label='PEGASIS Protocol', color='#3B82F6', linewidth=2.0)
    ax1.plot(df_results["Round"], df_results["HYBRID_Alive"], label='Hybrid LEACH–PEGASIS (Proposed)', color='#10B981', linewidth=2.5)
    ax1.set_title('Network Lifetime: Alive Nodes vs. Simulation Rounds', fontsize=11.5, fontweight='bold', pad=10)
    ax1.set_xlabel('Simulation Rounds', fontsize=10)
    ax1.set_ylabel('Number of Alive Sensor Nodes', fontsize=10)
    ax1.grid(True, linestyle='--', color='#CBD5E1', alpha=0.7)
    ax1.legend(loc='upper right', fontsize=9.5, framealpha=0.95)

    # Plot 2: Energy Decay
    ax2.plot(df_results["Round"], df_results["LEACH_Energy"], label='LEACH Energy Decay', color='#EF4444', linestyle='--', linewidth=1.8)
    ax2.plot(df_results["Round"], df_results["PEGASIS_Energy"], label='PEGASIS Energy Decay', color='#3B82F6', linestyle='-.', linewidth=1.8)
    ax2.plot(df_results["Round"], df_results["HYBRID_Energy"], label='Hybrid Energy Decay', color='#10B981', linewidth=2.2)
    ax2.set_title('Average Residual Energy vs. Simulation Rounds', fontsize=11.5, fontweight='bold', pad=10)
    ax2.set_xlabel('Simulation Rounds', fontsize=10)
    ax2.set_ylabel('Average Residual Energy (Joules)', fontsize=10)
    ax2.grid(True, linestyle='--', color='#CBD5E1', alpha=0.7)
    ax2.legend(loc='upper right', fontsize=9.5, framealpha=0.95)

    plt.tight_layout()
    plt.savefig("results/plots/routing_comparison_lifetime.png", bbox_inches='tight', dpi=300)
    plt.close()

    print("\n[SUMMARY RESULTS]")
    print(f"  • LEACH Lifetime   : FND = Round {l_fnd} | HND = Round {l_hnd}")
    print(f"  • PEGASIS Lifetime : FND = Round {p_fnd} | HND = Round {p_hnd}")
    print(f"  • HYBRID Lifetime  : FND = Round {h_fnd} | HND = Round {h_hnd} (Outlasts LEACH by +{((h_fnd-l_fnd)/l_fnd)*100:.0f}%)")
    print(f"\n  📁 Results saved to results/raw/routing_comparison_1000_rounds.csv")
    print(f"  📁 Lifetime Plot saved to results/plots/routing_comparison_lifetime.png")
    print("=" * 75)


if __name__ == "__main__":
    run_deployment_and_routing_pipeline()

