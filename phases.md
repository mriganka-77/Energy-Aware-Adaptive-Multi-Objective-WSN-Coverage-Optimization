# Phases --- WSN Coverage Maximization & Overlap Reduction

## Phase 0 --- Research Gap and Problem Definition

### Tasks

-   Review recent WSN coverage optimization literature.
-   Identify existing PSO, MOPSO, VFA and Voronoi approaches.
-   Identify what has already been combined.
-   Define a precise research gap.
-   Decide whether sensors are mobile or whether only
    activation/deployment selection is optimized.

### Deliverables

-   literature matrix,
-   problem statement,
-   research objectives,
-   novelty hypothesis.

### Exit Criteria

The project must have a defensible research gap before claiming novelty.

------------------------------------------------------------------------

## Phase 1 --- WSN Simulation Foundation

### Tasks

-   Create sensor and network classes.
-   Create configurable sensing field.
-   Implement random deployment.
-   Implement sensing-radius model.
-   Implement communication-radius model.
-   Implement energy model.

### Deliverables

-   working baseline simulator,
-   configuration file,
-   initial deployment visualization.

------------------------------------------------------------------------

## Phase 2 --- Coverage and Overlap Engine

### Tasks

Implement:

-   coverage ratio,
-   overlap ratio,
-   coverage-hole detection,
-   coverage heatmap,
-   overlap heatmap,
-   sensor connectivity.

### Deliverables

-   coverage calculator,
-   overlap calculator,
-   visualization module.

### Validation

Test manually constructed sensor configurations where expected
coverage/overlap is known.

------------------------------------------------------------------------

## Phase 3 --- Baseline Algorithms

Implement separately:

1.  Random deployment,
2.  PSO,
3.  GA,
4.  VFA,
5.  Voronoi-based optimization,
6.  MOPSO.

### Deliverables

A common interface:

``` text
optimize(initial_network, config) -> optimized_network
```

All algorithms must use the same evaluation engine.

------------------------------------------------------------------------

## Phase 4 --- Proposed Coverage Algorithm

Implement the proposed framework:

``` text
MOPSO
  + Voronoi analysis
  + Virtual Force correction
  + Energy-aware constraints
```

### Tasks

-   implement Pareto archive,
-   implement adaptive objective weighting if justified,
-   implement Voronoi-guided decisions,
-   implement virtual-force correction,
-   implement movement constraints,
-   implement energy-aware decisions.

### Deliverables

-   proposed optimizer,
-   convergence logging,
-   optimized deployment plots.

------------------------------------------------------------------------

## Phase 5 --- Routing Integration

Connect optimized deployment to the existing Hybrid LEACH--PEGASIS
model.

Pipeline:

``` text
Initial Deployment
       ↓
Coverage Optimization
       ↓
Optimized Positions
       ↓
Hybrid LEACH–PEGASIS
       ↓
Data Transmission
       ↓
Energy / Lifetime Metrics
```

Keep both modules independently testable.

------------------------------------------------------------------------

## Phase 6 --- Experiment Framework

Run multiple network scenarios.

Suggested scenarios:

  Scenario       Field   Nodes Purpose
  ---------- --------- ------- ----------------
  S1             50x50      25 Small network
  S2           100x100      50 Medium network
  S3           100x100     100 Dense network
  S4           200x200     100 Large field
  S5           100x100     150 High density

Use multiple random seeds for every scenario.

------------------------------------------------------------------------

## Phase 7 --- Ablation Study

Measure the effect of:

-   Voronoi,
-   VFA,
-   energy awareness,
-   adaptive weighting.

Compare:

``` text
MOPSO
MOPSO + Voronoi
MOPSO + VFA
MOPSO + Energy
MOPSO + Voronoi + VFA
Full Proposed Method
```

------------------------------------------------------------------------

## Phase 8 --- Statistical Evaluation

For each algorithm and scenario calculate:

-   mean,
-   standard deviation,
-   median,
-   confidence interval where appropriate.

Possible statistical tests:

-   Wilcoxon signed-rank test for paired comparisons,
-   Friedman test for multiple algorithms/scenarios.

Report effect sizes where appropriate.

------------------------------------------------------------------------

## Phase 9 --- Visualization

Generate:

1.  initial deployment,
2.  optimized deployment,
3.  coverage heatmap,
4.  overlap heatmap,
5.  Voronoi diagram,
6.  sensor movement trajectories,
7.  coverage vs iteration,
8.  overlap vs iteration,
9.  fitness vs iteration,
10. energy vs round,
11. alive nodes vs round,
12. network lifetime comparison.

------------------------------------------------------------------------

## Phase 10 --- Research Paper

Suggested paper structure:

1.  Abstract
2.  Introduction
3.  Related Work
4.  Problem Formulation
5.  Proposed Method
6.  Mathematical Model
7.  Experimental Setup
8.  Results
9.  Ablation Study
10. Statistical Analysis
11. Limitations
12. Conclusion
13. Future Work

### Important

Do not claim:

> "This is the first algorithm of its kind"

unless the literature review supports that statement.

Instead establish novelty through a clearly documented gap.

------------------------------------------------------------------------

## Phase 11 --- Final Demonstration

Create an interactive simulation dashboard showing:

-   sensor deployment,
-   coverage percentage,
-   overlap percentage,
-   coverage holes,
-   residual energy,
-   optimization progress,
-   routing progress.

The final demonstration should allow changing:

-   number of sensors,
-   field size,
-   sensing radius,
-   initial energy,
-   algorithm,
-   PSO parameters.
