# PRD --- Energy-Aware WSN Coverage Maximization and Overlap Reduction

## 1. Product Name

**Energy-Aware Adaptive Multi-Objective WSN Coverage Optimization**

Working algorithm name:

**EA-VVF-MOPSO**

Expanded name:

**Energy-Aware Adaptive Voronoi--Virtual Force Multi-Objective Particle
Swarm Optimization**

This is a working research name and should be finalized only after the
literature-gap study.

------------------------------------------------------------------------

## 2. Problem Statement

Wireless Sensor Networks often contain redundant sensing regions where
multiple sensors monitor the same physical area while other regions
remain weakly covered or completely uncovered.

The project will develop a simulation-based optimization framework that:

-   maximizes sensing coverage,
-   minimizes redundant overlap,
-   reduces coverage holes,
-   considers residual energy,
-   maintains connectivity,
-   limits unnecessary sensor movement.

The optimized deployment will then be evaluated with the user's Hybrid
LEACH--PEGASIS routing protocol.

------------------------------------------------------------------------

## 3. Product Goal

Develop a reproducible WSN simulator and optimization framework capable
of comparing established deployment strategies against the proposed
energy-aware multi-objective method.

The final system should produce publication-quality experiments and
visualizations.

------------------------------------------------------------------------

## 4. Target Users

### Primary

-   B.Tech CSE project team,
-   academic supervisor,
-   WSN/optimization researchers.

### Secondary

-   students reproducing the experiments,
-   researchers extending the simulator.

------------------------------------------------------------------------

## 5. Functional Requirements

### FR-01: Network Configuration

The system shall allow configuration of:

-   field width,
-   field height,
-   number of sensors,
-   sensing radius,
-   communication radius,
-   initial energy,
-   base-station coordinates,
-   maximum sensor movement,
-   number of optimization iterations,
-   random seed.

### FR-02: Deployment

The system shall support:

-   random deployment,
-   predefined deployment,
-   optimized deployment.

### FR-03: Coverage Calculation

The system shall calculate:

-   coverage percentage,
-   uncovered area,
-   coverage holes.

### FR-04: Overlap Calculation

The system shall calculate:

-   redundant coverage area,
-   overlap percentage,
-   average coverage multiplicity.

### FR-05: PSO/MOPSO

The system shall optimize sensor positions using PSO/MOPSO.

### FR-06: Voronoi Analysis

The system shall generate Voronoi-based geometric information from
sensor positions.

### FR-07: Virtual Force

The system shall calculate movement forces based on:

-   uncovered regions,
-   excessive sensor proximity/redundancy,
-   field boundaries.

### FR-08: Energy Awareness

The optimizer shall consider residual energy when deciding
movement/optimization actions.

### FR-09: Routing

The system shall support Hybrid LEACH--PEGASIS after deployment
optimization.

### FR-10: Experiment Runner

The system shall run repeatable experiments across multiple algorithms,
configurations and random seeds.

### FR-11: Visualization

The system shall produce:

-   deployment maps,
-   coverage heatmaps,
-   overlap heatmaps,
-   Voronoi diagrams,
-   movement paths,
-   convergence graphs,
-   energy/lifetime graphs.

### FR-12: Export

The system shall export raw results to CSV/JSON.

------------------------------------------------------------------------

## 6. Non-Functional Requirements

### Reproducibility

Every experiment must be reproducible from recorded configuration and
seed.

### Modularity

Coverage optimization and routing must be independent modules.

### Performance

Vectorized numerical operations should be preferred for large coverage
grids.

### Reliability

Invalid sensor coordinates and out-of-bound movement must be handled
safely.

### Extensibility

The simulator should make it easy to add future algorithms such as:

-   NSGA-II,
-   GWO,
-   ACO,
-   DE,
-   reinforcement-learning-based deployment.

------------------------------------------------------------------------

## 7. User Workflow

``` text
Open Simulator
     ↓
Select Network Parameters
     ↓
Select Algorithm
     ↓
Run Optimization
     ↓
View Initial Deployment
     ↓
View Optimized Deployment
     ↓
View Coverage / Overlap
     ↓
Run Routing
     ↓
View Energy / Lifetime
     ↓
Export Results
```

------------------------------------------------------------------------

## 8. Core Metrics

### Coverage

`Coverage% = CoveredArea / TotalArea × 100`

### Overlap

Report the selected overlap definition consistently across all
algorithms.

### Coverage Holes

`Hole% = UncoveredArea / TotalArea × 100`

### Energy

-   total energy consumed,
-   average residual energy,
-   minimum residual energy.

### Lifetime

-   First Node Death,
-   Half Node Death,
-   Last Node Death.

### Routing

-   packets delivered,
-   packet delivery ratio,
-   throughput,
-   communication energy.

### Optimization

-   convergence iteration,
-   final fitness,
-   runtime.

------------------------------------------------------------------------

## 9. Acceptance Criteria

The project is considered technically complete when:

-   [ ] baseline random deployment works,
-   [ ] coverage calculation is validated,
-   [ ] overlap calculation is validated,
-   [ ] PSO works,
-   [ ] MOPSO/Pareto handling works,
-   [ ] Voronoi analysis works,
-   [ ] VFA repositioning works,
-   [ ] energy awareness works,
-   [ ] Hybrid LEACH--PEGASIS integrates successfully,
-   [ ] all algorithms use identical evaluation conditions,
-   [ ] at least 30 random seeds are used for main experiments,
-   [ ] ablation experiments are completed,
-   [ ] statistical analysis is completed,
-   [ ] results are exported,
-   [ ] publication-quality figures are generated.

------------------------------------------------------------------------

## 10. Research Hypotheses

### H1

The proposed deployment method can improve sensing coverage compared
with baseline deployment strategies.

### H2

The proposed method can reduce redundant sensing overlap.

### H3

Energy-aware optimization can reduce unnecessary sensor movement and
energy expenditure.

### H4

Optimized deployment combined with Hybrid LEACH--PEGASIS can improve
network-level energy/lifetime metrics relative to routing on an
unoptimized deployment.

These are hypotheses to test, not guaranteed outcomes.

------------------------------------------------------------------------

## 11. Experimental Matrix

Each algorithm should be tested under identical:

-   node locations/seeds,
-   field dimensions,
-   sensing radius,
-   communication radius,
-   initial energy,
-   stopping criteria.

Primary comparison:

``` text
Random
PSO
GA
VFA
Voronoi
MOPSO
EA-VVF-MOPSO
```

Routing comparison can separately evaluate:

``` text
Baseline deployment + Hybrid LEACH–PEGASIS
Optimized deployment + Hybrid LEACH–PEGASIS
```

------------------------------------------------------------------------

## 12. Research Contribution Candidates

The project should aim to contribute:

1.  A multi-objective WSN coverage formulation.
2.  An energy-aware deployment optimization strategy.
3.  Voronoi-guided redundancy/hole analysis.
4.  Virtual-force-based local repositioning.
5.  Integration with Hybrid LEACH--PEGASIS.
6.  Comprehensive baseline and ablation evaluation.

The exact contribution claims must be finalized after the literature
review.

------------------------------------------------------------------------

## 13. Risks

### Risk 1: Low novelty

Mitigation:

Perform a systematic literature review before finalizing the algorithm.

### Risk 2: Algorithm becomes too complex

Mitigation:

Build each component independently and validate it before integration.

### Risk 3: Poor convergence

Mitigation:

Tune PSO parameters and perform sensitivity analysis.

### Risk 4: Coverage improves but energy worsens

Mitigation:

Keep energy and movement cost in the objective formulation.

### Risk 5: Results depend on one random deployment

Mitigation:

Use multiple random seeds and statistical tests.

### Risk 6: Routing and coverage effects become difficult to separate

Mitigation:

Report deployment-level and routing-level metrics separately.

------------------------------------------------------------------------

## 14. Future Extensions

Possible future research:

-   dynamic sensor failure,
-   heterogeneous sensing radii,
-   probabilistic sensing,
-   obstacle-aware deployment,
-   3D WSN,
-   mobile sink,
-   adaptive sensing/sleep scheduling,
-   NSGA-II comparison,
-   reinforcement learning,
-   graph neural networks.

------------------------------------------------------------------------

## 15. Final System

``` text
                 WSN
                  |
                  v
       +----------------------+
       | Initial Deployment   |
       +----------+-----------+
                  |
                  v
       +----------------------+
       | EA-VVF-MOPSO         |
       |                      |
       | MOPSO                |
       | Voronoi              |
       | Virtual Force        |
       | Energy Awareness     |
       +----------+-----------+
                  |
                  v
       +----------------------+
       | Optimized Deployment |
       +----------+-----------+
                  |
                  v
       +----------------------+
       | Hybrid LEACH–PEGASIS |
       +----------+-----------+
                  |
                  v
       +----------------------+
       | Performance Metrics  |
       +----------+-----------+
                  |
                  v
       Coverage | Overlap | Energy
       Lifetime | Throughput | PDR
```

## 16. Definition of Done

The project is ready for paper preparation when the proposed method has:

-   a clearly defined research gap,
-   mathematically defined objectives,
-   reproducible implementation,
-   fair baseline comparisons,
-   ablation experiments,
-   multiple random seeds,
-   statistical evaluation,
-   documented limitations,
-   reproducible results,
-   and figures/tables suitable for academic publication.
