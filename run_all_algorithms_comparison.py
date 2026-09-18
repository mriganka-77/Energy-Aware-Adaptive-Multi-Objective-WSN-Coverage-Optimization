"""
Comprehensive WSN Coverage Optimization Benchmark Suite.
Compares Random, Standard PSO, GA, VFA, Voronoi, Standard MOPSO, and Proposed EA-VVF-MOPSO
across spatial coverage, overlap reduction, mobility energy, and downstream Hybrid routing lifetime.
"""

import os
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.config.simulation_config import NetworkConfig
from src.models.network import WSNNetwork
from src.coverage.coverage_model import CoverageEvaluator
from src.coverage.overlap import OverlapEvaluator
from src.coverage.holes import HoleDetector
from src.optimization.pso import StandardPSO
from src.optimization.ga import GeneticAlgorithm
from src.optimization.vfa import VirtualForceOptimizer
from src.optimization.voronoi_opt import VoronoiOptimizer
from src.optimization.mopso import StandardMOPSO
from src.optimization.ea_vvf_mopso import EAVVFMOPSO
from src.routing.hybrid_leach_pegasis import HybridLEACHPEGASISSimulator
from src.routing.radio_energy_model import RadioEnergyModel


def evaluate_deployment_metrics(coords, initial_coords, config, cov_eval, or_eval, hole_eval):
    """Calculates all spatial and energy metrics for a given deployment topology."""
    cov, count_mat = cov_eval.evaluate_coverage(coords, config.sensing_radius)
    or_cov, or_tot, n_red, mult = or_eval.evaluate_overlap(count_mat)
    hole_ratio, _, _ = hole_eval.evaluate_holes(count_mat)
    
    displacement = float(np.sum(np.hypot(coords[:, 0] - initial_coords[:, 0], coords[:, 1] - initial_coords[:, 1])))
    relocation_energy = displacement * 0.005 # 0.005 J per meter
    
    return {
        'coverage_ratio': float(cov),
        'overlap_ratio': float(or_cov * 100.0),
        'hole_ratio': float(hole_ratio),
        'multiplicity': float(mult),
        'total_displacement': float(displacement),
        'relocation_energy': float(relocation_energy)
    }


def run_full_benchmark():
    print("=" * 80)
    print("🏆 FULL ALGORITHMS BENCHMARK: 6 BASELINES vs. PROPOSED EA-VVF-MOPSO")
    print("=" * 80)
    
    config = NetworkConfig(
        field_width=100.0,
        field_height=100.0,
        num_sensors=50,
        sensing_radius=15.0,
        communication_radius=30.0,
        initial_energy=0.5,
        random_seed=42
    )
    
    network = WSNNetwork(config)
    initial_coords = network.get_positions_array()
    
    cov_eval = CoverageEvaluator(config.field_width, config.field_height, resolution=1.0)
    or_eval = OverlapEvaluator(cov_eval)
    hole_eval = HoleDetector(cov_eval)
    radio = RadioEnergyModel(sink_x=50.0, sink_y=150.0)
    hybrid_router = HybridLEACHPEGASISSimulator(radio_model=radio)
    
    results = []
    convergence_dict = {}
    deployment_dict = {}
    
    # 1. Random Deployment (Baseline)
    print("\n[1/7] Evaluating Random Deployment...")
    rand_metrics = evaluate_deployment_metrics(initial_coords, initial_coords, config, cov_eval, or_eval, hole_eval)
    _, _, rand_fnd, rand_hnd, _ = hybrid_router.run_simulation(initial_coords, max_rounds=1000)
    rand_metrics.update({'algorithm': 'Random (Baseline)', 'runtime_ms': 0.0, 'FND': rand_fnd, 'HND': rand_hnd})
    results.append(rand_metrics)
    deployment_dict['Random'] = initial_coords
    convergence_dict['Random'] = [rand_metrics['coverage_ratio']] * 50

    # 2. Standard PSO
    print("\n[2/7] Running Standard PSO Optimizer...")
    t0 = time.time()
    pso = StandardPSO(config.field_width, config.field_height, config.sensing_radius, num_particles=25)
    pso_coords, pso_hist = pso.optimize(network, max_iterations=45)
    pso_time = (time.time() - t0) * 1000.0
    pso_metrics = evaluate_deployment_metrics(pso_coords, initial_coords, config, cov_eval, or_eval, hole_eval)
    _, _, pso_fnd, pso_hnd, _ = hybrid_router.run_simulation(pso_coords, max_rounds=1000)
    pso_metrics.update({'algorithm': 'Standard PSO', 'runtime_ms': pso_time, 'FND': pso_fnd, 'HND': pso_hnd})
    results.append(pso_metrics)
    deployment_dict['Standard PSO'] = pso_coords
    convergence_dict['Standard PSO'] = pso_hist

    # 3. Genetic Algorithm (GA)
    print("\n[3/7] Running Genetic Algorithm (GA)...")
    t0 = time.time()
    ga = GeneticAlgorithm(config.field_width, config.field_height, config.sensing_radius, pop_size=25)
    ga_coords, ga_hist = ga.optimize(network, max_generations=45)
    ga_time = (time.time() - t0) * 1000.0
    ga_metrics = evaluate_deployment_metrics(ga_coords, initial_coords, config, cov_eval, or_eval, hole_eval)
    _, _, ga_fnd, ga_hnd, _ = hybrid_router.run_simulation(ga_coords, max_rounds=1000)
    ga_metrics.update({'algorithm': 'Genetic Algorithm (GA)', 'runtime_ms': ga_time, 'FND': ga_fnd, 'HND': ga_hnd})
    results.append(ga_metrics)
    deployment_dict['GA'] = ga_coords
    convergence_dict['GA'] = ga_hist

    # 4. Virtual Force Algorithm (VFA)
    print("\n[4/7] Running Virtual Force Algorithm (VFA)...")
    t0 = time.time()
    vfa = VirtualForceOptimizer(config.field_width, config.field_height, config.sensing_radius)
    vfa_coords, vfa_hist = vfa.optimize(network, max_iterations=45)
    vfa_time = (time.time() - t0) * 1000.0
    vfa_metrics = evaluate_deployment_metrics(vfa_coords, initial_coords, config, cov_eval, or_eval, hole_eval)
    _, _, vfa_fnd, vfa_hnd, _ = hybrid_router.run_simulation(vfa_coords, max_rounds=1000)
    vfa_metrics.update({'algorithm': 'VFA (Virtual Force)', 'runtime_ms': vfa_time, 'FND': vfa_fnd, 'HND': vfa_hnd})
    results.append(vfa_metrics)
    deployment_dict['VFA'] = vfa_coords
    convergence_dict['VFA'] = vfa_hist

    # 5. Centroidal Voronoi Optimizer
    print("\n[5/7] Running Centroidal Voronoi Optimizer...")
    t0 = time.time()
    vor_opt = VoronoiOptimizer(config.field_width, config.field_height, config.sensing_radius)
    vor_coords, vor_hist = vor_opt.optimize(network, max_iterations=45)
    vor_time = (time.time() - t0) * 1000.0
    vor_metrics = evaluate_deployment_metrics(vor_coords, initial_coords, config, cov_eval, or_eval, hole_eval)
    _, _, vor_fnd, vor_hnd, _ = hybrid_router.run_simulation(vor_coords, max_rounds=1000)
    vor_metrics.update({'algorithm': 'Centroidal Voronoi', 'runtime_ms': vor_time, 'FND': vor_fnd, 'HND': vor_hnd})
    results.append(vor_metrics)
    deployment_dict['Voronoi'] = vor_coords
    convergence_dict['Voronoi'] = vor_hist

    # 6. Standard MOPSO
    print("\n[6/7] Running Standard MOPSO...")
    t0 = time.time()
    mopso = StandardMOPSO(config.field_width, config.field_height, config.sensing_radius, num_particles=25)
    mopso_coords, mopso_hist, mopso_archive = mopso.optimize(network, max_iterations=45)
    mopso_time = (time.time() - t0) * 1000.0
    mopso_metrics = evaluate_deployment_metrics(mopso_coords, initial_coords, config, cov_eval, or_eval, hole_eval)
    _, _, mopso_fnd, mopso_hnd, _ = hybrid_router.run_simulation(mopso_coords, max_rounds=1000)
    mopso_metrics.update({'algorithm': 'Standard MOPSO', 'runtime_ms': mopso_time, 'FND': mopso_fnd, 'HND': mopso_hnd})
    results.append(mopso_metrics)
    deployment_dict['MOPSO'] = mopso_coords
    convergence_dict['MOPSO'] = mopso_hist

    # 7. Proposed EA-VVF-MOPSO
    print("\n[7/7] Running Proposed EA-VVF-MOPSO Framework...")
    t0 = time.time()
    ea_vvf = EAVVFMOPSO(config.field_width, config.field_height, config.sensing_radius, num_particles=25)
    ea_coords, ea_hist, ea_archive = ea_vvf.optimize(network, max_iterations=45)
    ea_time = (time.time() - t0) * 1000.0
    ea_metrics = evaluate_deployment_metrics(ea_coords, initial_coords, config, cov_eval, or_eval, hole_eval)
    _, _, ea_fnd, ea_hnd, _ = hybrid_router.run_simulation(ea_coords, max_rounds=1000)
    ea_metrics.update({'algorithm': 'EA-VVF-MOPSO (Proposed)', 'runtime_ms': ea_time, 'FND': ea_fnd, 'HND': ea_hnd})
    results.append(ea_metrics)
    deployment_dict['EA-VVF-MOPSO'] = ea_coords
    convergence_dict['EA-VVF-MOPSO'] = [h['coverage'] for h in ea_hist]

    # Export Results Table
    os.makedirs("results/metrics", exist_ok=True)
    os.makedirs("results/plots", exist_ok=True)
    
    df_results = pd.DataFrame(results)
    df_results.to_csv("results/metrics/algorithms_comparison_summary.csv", index=False)
    
    print("\n" + "=" * 80)
    print("📊 BENCHMARK COMPARISON MATRIX (100x100m, N=50 Nodes):")
    print("=" * 80)
    print(df_results[['algorithm', 'coverage_ratio', 'overlap_ratio', 'hole_ratio', 'total_displacement', 'FND', 'HND']].to_string(index=False))

    # ==================== PLOT 1: BAR CHART METRICS ====================
    fig, axs = plt.subplots(2, 2, figsize=(12, 9), dpi=300)
    plt.subplots_adjust(wspace=0.25, hspace=0.35)
    
    algos = df_results['algorithm']
    colors_list = ['#64748B', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899', '#10B981']
    
    # Coverage %
    axs[0, 0].barh(algos, df_results['coverage_ratio'], color=colors_list)
    axs[0, 0].set_title('Sensing Coverage Ratio (%) — Higher is Better', fontsize=10.5, fontweight='bold')
    axs[0, 0].set_xlim(80, 100)
    for i, v in enumerate(df_results['coverage_ratio']): axs[0, 0].text(v + 0.3, i, f"{v:.1f}%", va='center', fontsize=8.5)
    
    # Overlap %
    axs[0, 1].barh(algos, df_results['overlap_ratio'], color=colors_list)
    axs[0, 1].set_title('Redundant Overlap Ratio (%) — Lower is Better', fontsize=10.5, fontweight='bold')
    for i, v in enumerate(df_results['overlap_ratio']): axs[0, 1].text(v + 0.5, i, f"{v:.1f}%", va='center', fontsize=8.5)
    
    # Displacement (Movement)
    axs[1, 0].barh(algos, df_results['total_displacement'], color=colors_list)
    axs[1, 0].set_title('Total Sensor Displacement (Meters) — Lower is Better', fontsize=10.5, fontweight='bold')
    for i, v in enumerate(df_results['total_displacement']): axs[1, 0].text(v + 5, i, f"{v:.0f}m", va='center', fontsize=8.5)
    
    # Hybrid Routing First Node Death
    axs[1, 1].barh(algos, df_results['FND'], color=colors_list)
    axs[1, 1].set_title('Hybrid Routing First Node Death (Round) — Higher is Better', fontsize=10.5, fontweight='bold')
    for i, v in enumerate(df_results['FND']): axs[1, 1].text(v + 10, i, f"Rnd {v}", va='center', fontsize=8.5)
    
    plt.savefig("results/plots/algorithms_comparison_metrics.png", bbox_inches='tight', dpi=300)
    plt.close()

    # ==================== PLOT 2: CONVERGENCE CURVES ====================
    fig2, ax2 = plt.subplots(figsize=(10, 6), dpi=300)
    for algo, hist in convergence_dict.items():
        if algo != 'Random':
            ax2.plot(hist, label=algo, linewidth=2.0)
    ax2.set_title('Optimization Convergence: Coverage Ratio (%) vs. Iterations', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Iteration Step', fontsize=10.5)
    ax2.set_ylabel('Coverage Ratio (%)', fontsize=10.5)
    ax2.grid(True, linestyle='--', alpha=0.7)
    ax2.legend(loc='lower right', fontsize=9.5)
    plt.savefig("results/plots/algorithms_convergence_curves.png", bbox_inches='tight', dpi=300)
    plt.close()

    # ==================== PLOT 3: PARETO FRONT ====================
    fig3, ax3 = plt.subplots(figsize=(8, 6), dpi=300)
    # Extract archive points
    objs_ea = np.array([m['objs'] for m in ea_archive.solutions])
    objs_mopso = np.array([m['objs'] for m in mopso_archive.solutions])
    
    ax3.scatter(objs_mopso[:, 0], -objs_mopso[:, 1], color='#EC4899', s=70, alpha=0.7, label='Standard MOPSO Pareto Set')
    ax3.scatter(objs_ea[:, 0], -objs_ea[:, 1], color='#10B981', s=100, marker='*', label='EA-VVF-MOPSO Non-Dominated Front')
    
    ax3.set_title('Pareto Objective Trade-off: Coverage (%) vs. Overlap (%)', fontsize=11.5, fontweight='bold')
    ax3.set_xlabel('Coverage Ratio (%) [Maximize ->]', fontsize=10)
    ax3.set_ylabel('Overlap Ratio (%) [Minimize ->]', fontsize=10)
    ax3.grid(True, linestyle='--', alpha=0.7)
    ax3.legend(loc='lower left', fontsize=9)
    plt.savefig("results/plots/pareto_front_scatter.png", bbox_inches='tight', dpi=300)
    plt.close()

    print("\nGenerated Publication Comparison Plots:")
    print("  📁 results/plots/algorithms_comparison_metrics.png")
    print("  📁 results/plots/algorithms_convergence_curves.png")
    print("  📁 results/plots/pareto_front_scatter.png")
    print("\n" + "=" * 80)
    print("🎉 FULL ALGORITHM COMPARISON COMPLETED SUCCESSFULLY!")
    print("=" * 80)


if __name__ == "__main__":
    run_full_benchmark()
