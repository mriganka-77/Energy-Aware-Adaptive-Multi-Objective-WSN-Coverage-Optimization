# Architecture --- Energy-Aware WSN Coverage Optimization

## 1. Project Overview

The system optimizes Wireless Sensor Network (WSN) sensor deployment to:

-   maximize sensing coverage,
-   minimize redundant/overlapping coverage,
-   reduce coverage holes,
-   consider residual sensor energy,
-   preserve network connectivity, and
-   minimize unnecessary sensor movement.

After deployment optimization, the optimized network can use the user's
existing Hybrid LEACH--PEGASIS routing protocol for energy-efficient
communication.

> **Important:** The proposed combination is a research direction, not a
> claim that the exact combination is unprecedented. Novelty must be
> established through a literature review.

## 2. High-Level Architecture

``` text
                    WSN Configuration
                           |
                           v
              +-------------------------+
              | Initial Sensor Deployment|
              +------------+------------+
                           |
                           v
              +-------------------------+
              | Coverage Evaluation     |
              | - Coverage ratio        |
              | - Overlap ratio          |
              | - Coverage holes        |
              | - Residual energy       |
              | - Connectivity          |
              +------------+------------+
                           |
                           v
              +-------------------------+
              | Multi-Objective PSO      |
              | Global position search   |
              +------------+------------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
   +-------------------+       +-------------------+
   | Voronoi Analysis  |       | Virtual Force     |
   | Detect redundancy |       | Correct positions |
   | & weak regions    |       | / coverage holes  |
   +---------+---------+       +---------+---------+
             |                           |
             +-------------+-------------+
                           |
                           v
              +-------------------------+
              | Energy-Aware Controller |
              | Position/energy checks  |
              +------------+------------+
                           |
                    convergence?
                     /        \
                   No          Yes
                   |            |
                   +------------+
                                v
                 Optimized Sensor Deployment
                                |
                                v
                 Hybrid LEACH–PEGASIS Routing
                                |
                                v
                     Data Transmission to BS
                                |
                                v
                     Performance Evaluation
```

## 3. Main Components

### 3.1 WSN Environment

Inputs:

-   sensing field width and height,
-   number of sensors,
-   sensing radius,
-   communication radius,
-   initial energy,
-   sink/base-station position,
-   mobility limit,
-   simulation rounds,
-   random seed.

### 3.2 Coverage Evaluation Engine

A grid-based sensing model is recommended for the first implementation.

For every evaluation point, determine whether at least one sensor covers
it.

Primary metric:

`Coverage = covered_points / total_points`

### 3.3 Overlap Evaluation

For every evaluation point, count how many sensors cover it.

-   count = 0 → coverage hole
-   count = 1 → uniquely covered
-   count \> 1 → redundant/overlapping coverage

This produces both an overlap ratio and a redundancy map.

### 3.4 MOPSO Layer

Each particle represents one complete sensor deployment.

``` text
Particle = [x1,y1,x2,y2,...,xN,yN]
```

The optimizer searches for deployments satisfying multiple objectives.

Candidate objectives:

-   maximize coverage,
-   minimize overlap,
-   minimize holes,
-   maximize residual energy,
-   maximize connectivity,
-   minimize movement.

### 3.5 Voronoi Layer

Voronoi cells are generated from sensor positions.

Uses:

-   identify sensors with very small/inefficient useful regions,
-   identify sparse regions,
-   support hole/redundancy detection,
-   provide geometric information to the optimizer.

Voronoi is an analysis/decision component, not necessarily the main
optimizer.

### 3.6 Virtual Force Layer

Virtual forces modify sensor positions.

Conceptually:

-   attractive force toward uncovered regions,
-   repulsive force between excessively redundant/close sensors,
-   boundary force to keep sensors inside the field.

The movement must respect maximum displacement constraints.

### 3.7 Energy-Aware Controller

Avoid moving or repeatedly selecting sensors with critically low
residual energy.

Possible energy factor:

`EnergyFactor = average(residual_energy_i / initial_energy_i)`

A sensor below an energy threshold can be protected from unnecessary
movement.

### 3.8 Routing Layer

After optimized deployment:

`Optimized Positions -> Hybrid LEACH–PEGASIS -> Base Station`

The routing layer evaluates:

-   energy consumption,
-   first node death,
-   half node death,
-   last node death,
-   packets delivered,
-   throughput,
-   network lifetime.

## 4. Data Flow

``` text
config.yaml
    |
    v
Deployment Generator
    |
    v
Coverage Grid
    |
    +--> Coverage Calculator
    +--> Overlap Calculator
    +--> Hole Detector
    +--> Energy Calculator
    +--> Connectivity Calculator
    |
    v
MOPSO
    |
    +--> Voronoi Analysis
    +--> Virtual Force Correction
    |
    v
Optimized Deployment
    |
    v
Hybrid LEACH–PEGASIS
    |
    v
Metrics + Logs
    |
    v
Plots / Tables / Statistical Analysis
```

## 5. Recommended Software Architecture

``` text
src/
├── config/
│   └── simulation_config.py
├── models/
│   ├── sensor.py
│   ├── network.py
│   └── particle.py
├── coverage/
│   ├── coverage_model.py
│   ├── overlap.py
│   ├── holes.py
│   └── voronoi.py
├── optimization/
│   ├── pso.py
│   ├── objectives.py
│   ├── virtual_force.py
│   └── energy_controller.py
├── routing/
│   └── hybrid_leach_pegasis.py
├── simulation/
│   ├── runner.py
│   └── experiments.py
├── metrics/
│   ├── coverage_metrics.py
│   ├── energy_metrics.py
│   └── routing_metrics.py
├── visualization/
│   ├── deployment_plot.py
│   ├── heatmap.py
│   ├── convergence.py
│   └── comparison.py
└── main.py
```

## 6. Design Principle

Keep **coverage optimization** and **routing optimization** modular.
This allows experiments to determine whether improvements come from the
deployment algorithm, the routing algorithm, or their integration.
