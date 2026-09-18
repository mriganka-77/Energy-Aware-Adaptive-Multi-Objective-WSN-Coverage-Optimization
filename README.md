# Energy-Aware Adaptive Multi-Objective WSN Coverage Optimization (EA-VVF-MOPSO) & Hierarchical Routing Laboratory

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r173-black.svg)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A research-grade Wireless Sensor Network (WSN) optimization framework that unifies **two-phase optimization**:
1. **Phase 1: Spatial Deployment Optimization** via **EA-VVF-MOPSO** (Energy-Aware Adaptive Voronoi–Virtual Force Multi-Objective Particle Swarm Optimization) to maximize sensing coverage, minimize redundant overlaps, eliminate sensing holes, and limit node displacement.
2. **Phase 2: Energy-Aware Data Routing** via **Hybrid LEACH–PEGASIS** and **PSO-Hybrid Routing** to balance energy dissipation, prolong network lifetime (FND, HND, LND), and maximize cumulative throughput.
3. **Interactive 3D Workbench**: A modern 3D Liquid Glass web workbench (Three.js + Chart.js + Vite) providing real-time spatial topologies, Voronoi tessellations, multi-hop routing chain visualizers, and comparative telemetry.

---

## 🔬 Key Research Innovations

### 1. EA-VVF-MOPSO Coverage Optimizer
- **Adaptive Voronoi Partitioning**: Dynamically computes local Voronoi polygons to identify under-covered sensing holes and density clumping.
- **Virtual Force Director (VFA)**: Combines attractive forces towards coverage gaps with repulsive forces away from crowded sensor clusters and physical boundaries.
- **Energy-Aware Movement Damping**: Weights displacement vectors by node residual energy, preventing depleted nodes from wasting scarce battery on relocation.
- **Pareto-Optimal Multi-Objective Formulation**: Simultaneously optimizes for coverage percentage, overlap minimization, and movement energy cost.

### 2. Hierarchical Energy-Aware Routing
- **LEACH**: Classical cluster-head rotation based on random probability threshold.
- **PEGASIS**: Greedy chain-based transmission with data fusion to eliminate cluster overhead.
- **Hybrid LEACH–PEGASIS**: Dynamic rotational cluster head selection combined with intra-cluster nearest-neighbor chaining and multi-hop CH routing to the sink.
- **PSO-Hybrid Routing**: Swarm intelligence optimizes cluster-head selection against a multi-factor fitness function (residual energy, sink distance, and intra-cluster compactness).

---

## 📁 Repository Structure

```
├── src/
│   ├── coverage/                 # Coverage models, Voronoi polygons, overlap & hole detection
│   ├── models/                   # Sensor node abstractions and network graph topology
│   ├── optimization/             # EA-VVF-MOPSO, MOPSO, GA, PSO, VFA, and Voronoi optimizers
│   ├── routing/                  # LEACH, PEGASIS, Hybrid LEACH-PEGASIS, and PSO-Hybrid routing
│   ├── visualization/            # 2D/3D Matplotlib plotters, heatmaps, and Pareto scatter charts
│   ├── config/                   # Simulation parameters, radio models, and field dimensions
│   ├── app.js                    # Core logic and Three.js engine for the interactive workbench
│   └── style.css                 # Liquid glass styling and UI components
├── data/                         # Datasets & benchmark energy tables
│   ├── hybrid_leach_pegasis_energy.csv
│   └── res-energy table.csv
├── results/                      # Generated figures, convergence charts, and metrics
│   ├── metrics/                  # CSV summaries of algorithm benchmarks
│   ├── plots/                    # High-resolution convergence curves & Voronoi plots
│   └── raw/                      # Raw simulation telemetry
├── legacy/                       # Preserved legacy scripts and benchmarks
│   ├── comparison.py             # Original comparative benchmark script
│   ├── pso_hybrid.py             # Original standalone PSO-Hybrid implementation
│   ├── hybrid.py / leach.py / pegasis.py
│   ├── res-energy table.csv
│   └── web/                      # Legacy React + Tailwind frontend
├── index.html                    # 3D Liquid Glass Interactive Web Workbench
├── package.json                  # Frontend dependencies (Three.js, Chart.js, Vite, Lucide)
├── requirements.txt              # Python dependencies (NumPy, SciPy, Matplotlib, Pandas)
├── PRD.md                        # Product Requirements & mathematical formulation
├── architecture.md               # Detailed system architecture specification
└── test_routing_protocols.py     # End-to-end deployment & routing integration test
```

---

## 🚀 Quickstart Guide

### 1. Python Environment Setup

Install the required Python scientific libraries:

```bash
# Optional: create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run Simulations & Benchmarks

- **End-to-End Pipeline (Deployment Optimization ➡️ Multi-Hop Routing)**:
  ```bash
  python3 test_routing_protocols.py
  ```

- **Comparative Optimization Benchmark (EA-VVF-MOPSO vs. GA vs. PSO vs. VFA)**:
  ```bash
  python3 run_all_algorithms_comparison.py
  ```

- **Run Legacy Routing Benchmark**:
  ```bash
  python3 legacy/comparison.py
  ```

Generated figures, heatmaps, and CSV records will be saved directly into `results/plots/` and `results/metrics/`.

---

## 🌐 3D Liquid Glass Web Workbench

The repository includes a modern, high-performance web dashboard featuring:
- **Interactive 3D Sensor Topology**: Orbit, inspect, and toggle sensing and communication spheres.
- **Dynamic Voronoi Tessellation & Multiplicity**: Real-time canvas rendering of Voronoi partitions and overlap density.
- **Routing Protocol Telemetry**: Interactive round-by-round visualization of alive nodes, residual energy depletion, and packet throughput.
- **Algorithmic Source Code Viewer & Formulation Theory**: Embedded code and mathematical explanations.

### Running the Web Dashboard Locally

```bash
# Install NPM dependencies
npm install

# Start local Vite development server
npm run dev
```

Visit `http://localhost:3000/` in your browser.

To build the static web application:
```bash
npm run build
```

---

## 📊 Benchmark Summary

| Metric | Random Initial | PSO Baseline | GA | VFA | EA-VVF-MOPSO (Proposed) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Coverage Area** | ~92.4% | ~95.1% | ~96.2% | ~94.8% | **~98.5%+** |
| **Overlap Ratio** | ~82.0% | ~68.4% | ~65.1% | ~67.8% | **~48.2%** |
| **Sensing Holes** | High | Moderate | Low | Moderate | **Minimal** |
| **Network Lifetime (LND)** | Baseline | +28% | +35% | +22% | **+65%** |

---

## 📜 Documentation

- [PRD.md](PRD.md) — Comprehensive product requirements, objective functions, and constraints.
- [architecture.md](architecture.md) — System architecture, module boundaries, and design patterns.
- [phases.md](phases.md) — Detailed implementation phases and milestone breakdown.
- [WSN_Coverage_Optimization_Complete_Guide.pdf](WSN_Coverage_Optimization_Complete_Guide.pdf) — Complete guide and theoretical background.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
