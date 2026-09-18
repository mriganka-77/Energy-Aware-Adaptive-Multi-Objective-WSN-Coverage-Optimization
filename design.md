# Design --- Energy-Aware Adaptive Coverage Optimization

## 1. Design Goal

Design a reproducible simulation framework for WSN coverage maximization
and overlap reduction.

The initial implementation should prioritize correctness and
reproducibility over algorithmic complexity.

## 2. Sensor Model

Each sensor has:

``` text
Sensor {
    id
    x
    y
    sensing_radius
    communication_radius
    initial_energy
    residual_energy
    active
}
```

Sensors are initially deployed randomly or loaded from a dataset.

## 3. Sensing Model

Use a binary disk model for the first version.

A point `p=(x,y)` is covered by sensor `i` if:

`distance(p, sensor_i) <= sensing_radius_i`

A future extension may use probabilistic sensing.

## 4. Coverage Grid

Discretize the sensing field into a regular grid.

Recommended initial settings:

-   field: 100 x 100 units,
-   grid resolution: 1 unit,
-   adjustable sensor count,
-   adjustable sensing radius.

The grid resolution must be configurable because finer grids increase
computational cost.

## 5. Coverage Metrics

### Coverage Ratio

`CR = Ncovered / Ntotal`

Report as percentage:

`Coverage% = CR * 100`

### Hole Ratio

`HR = Nuncovered / Ntotal`

### Overlap Ratio

For each grid point, calculate the number of covering sensors `k`.

A point is redundant when `k > 1`.

One simple overlap metric is:

`OR = Nredundant_points / Ncovered_points`

Also report average coverage multiplicity:

`Multiplicity = sum(k) / Ncovered`

These definitions should remain fixed across all experiments.

## 6. Multi-Objective Formulation

The optimization problem should balance several objectives.

A normalized scalar form for the initial implementation is:

`Fitness = wC*C - wO*O - wH*H + wE*E + wK*K - wM*M`

where:

-   `C` = normalized coverage,
-   `O` = normalized overlap,
-   `H` = normalized hole ratio,
-   `E` = normalized residual-energy factor,
-   `K` = connectivity factor,
-   `M` = normalized movement cost.

All components must be normalized to comparable ranges.

### Recommended initial weights

Use weights only as starting values:

``` text
wC = 0.35
wO = 0.20
wH = 0.15
wE = 0.15
wK = 0.10
wM = 0.05
```

Do not present these weights as universally optimal. Perform sensitivity
analysis later.

## 7. MOPSO Design

### Particle Representation

For `N` sensors:

`X = [x1,y1,x2,y2,...,xN,yN]`

Each particle is one candidate deployment.

### PSO Update

For each particle:

`v(t+1) = w*v(t) + c1*r1*(pbest-x) + c2*r2*(gbest-x)`

`x(t+1) = x(t) + v(t+1)`

Apply field-boundary constraints after every update.

### Multi-Objective Handling

Maintain a Pareto archive containing non-dominated solutions.

Objectives:

1.  maximize coverage,
2.  minimize overlap,
3.  minimize holes,
4.  maximize energy factor,
5.  maximize connectivity,
6.  minimize movement.

The first prototype may use a weighted fitness function, but the
research version should support a genuine Pareto archive.

## 8. Voronoi Design

Generate a Voronoi diagram from sensor coordinates.

Use the diagram to calculate geometric information such as:

-   cell area,
-   neighboring sensors,
-   sparse regions,
-   boundary regions.

A very small effective cell or high local redundancy can be used as a
signal for repositioning/activation decisions.

## 9. Virtual Force Design

For sensor `i`, calculate a movement vector:

`F_i = F_attraction + F_repulsion + F_boundary`

### Attraction

Move toward nearby uncovered/high-priority regions.

### Repulsion

Move away from sensors producing excessive redundancy.

### Boundary

Prevent movement outside the sensing field.

### Movement constraint

`||delta_i|| <= Dmax`

where `Dmax` is the maximum movement allowed per iteration.

## 10. Energy Awareness

Movement and optimization should consider residual energy.

A simple rule:

``` text
if residual_energy < energy_threshold:
    reduce movement priority
```

A more advanced implementation can make movement cost part of the
objective.

## 11. Routing Design

Once deployment converges:

1.  initialize residual energies,
2.  execute Hybrid LEACH--PEGASIS,
3.  transmit sensed data,
4.  subtract transmission/receiving/aggregation energy,
5.  record network metrics.

Keep routing independent from the coverage optimizer so that controlled
comparisons are possible.

## 12. Baselines

Required comparison algorithms:

-   Random deployment,
-   standard PSO,
-   Genetic Algorithm,
-   Virtual Force Algorithm,
-   Voronoi-based approach,
-   MOPSO,
-   proposed method.

Do not assume the proposed method will outperform every baseline before
experimentation.

## 13. Ablation Experiments

Run:

-   MOPSO only,
-   MOPSO + Voronoi,
-   MOPSO + VFA,
-   MOPSO + energy awareness,
-   MOPSO + Voronoi + VFA,
-   full proposed method.

This shows the contribution of each component.

## 14. Reproducibility

Every experiment should record:

-   random seed,
-   node count,
-   field dimensions,
-   sensing radius,
-   communication radius,
-   initial energy,
-   PSO parameters,
-   number of iterations,
-   objective weights,
-   movement limit.

Use at least 30 independent random seeds for the main statistical
comparison.

## 15. Output Files

Recommended outputs:

``` text
results/
├── raw/
├── optimized_deployments/
├── metrics/
├── plots/
└── statistical_tests/
```

Each experiment should produce machine-readable CSV/JSON results before
plotting.
