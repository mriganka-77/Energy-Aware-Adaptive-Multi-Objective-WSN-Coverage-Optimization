/**
 * ============================================================================
 * WSN SPATIAL TOPOLOGY & MULTI-HOP ROUTING LABORATORY
 * Precision Dark Theme • 3D Motion Theme • Physics Force Optimizer
 * Hardware Telemetry & First-Order Radio Energy Dissipation Model
 * ============================================================================
 */

import * as THREE from 'three';
import { Chart, registerables } from 'chart.js';
import { BENCHMARK_DEPLOYMENTS, BENCHMARK_FND } from './data/benchmark_deployments.js';

Chart.register(...registerables);

// ============================================================================
// 1. GLOBAL APPLICATION STATE
// ============================================================================
const STATE = {
  activeTab: '3d-sim',
  currentScenario: 's2',
  numSensors: 50,
  sensingRadius: 15,
  commRadius: 30,
  fieldWidth: 100,
  fieldHeight: 100,
  seed: 42,
  activeAlgorithm: 'random',
  isOptimizing: false,
  isOptimized: false,
  baselineMetrics: null,
  showBubbles: true,
  isOrbitCam: false,
  audioEnabled: true,
  nodes: [],
  obstacles: [],
  activeObstaclePreset: 'none',
  poiList: [],
  activePoiPreset: 'none',
  poiMetrics: {
    trackedCount: 0,
    totalCount: 0,
    trackingRatio: 100,
    avgSensorsPerTarget: 0
  },
  interactionMode: 'inspect',
  draggedNode: null,
  dutyCycleMode: 'none',
  dutyCycleMetrics: {
    awakeCount: 50,
    sleepCount: 0,
    deadCount: 0,
    harvestedJoules: 0
  },
  pathLossExponent: 2.0,
  activeJammerPreset: 'none',
  jammers: [],
  jammerMetrics: {
    droppedPackets: 0
  },
  metrics: {
    coverage: 94.57,
    overlap: 81.65,
    holes: 5.43,
    connectivity: 100.0,
    energy: 0.50,
    multiplicity: 3.18
  },
  charts: {
    lifetime: null,
    energy: null,
    radar: null
  }
};

// ============================================================================
// 2. SYNTHESIZED WEB AUDIO SOUND FX ENGINE (PRECISION TONES)
// ============================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const SFX = {
  click() {
    if (!STATE.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (_) { }
  },

  optimizePulse() {
    if (!STATE.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (_) { }
  },

  packetArrive() {
    if (!STATE.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(720, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1440, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) { }
  },

  nodeInject() {
    if (!STATE.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1080, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) { }
  },

  nodeDelete() {
    if (!STATE.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (_) { }
  },

  empBlast() {
    if (!STATE.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) { }
  },

  jammerJam() {
    if (!STATE.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) { }
  }
};

// ============================================================================
// 3. AMBIENT LIQUID DARK CANVAS
// ============================================================================
function initAmbientLiquidCanvas() {
  const canvas = document.getElementById('ambient-liquid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const blobs = [
    { x: width * 0.25, y: height * 0.35, vx: 0.25, vy: 0.2, r: 380, color: 'rgba(14, 116, 144, 0.25)' },
    { x: width * 0.75, y: height * 0.25, vx: -0.2, vy: 0.25, r: 420, color: 'rgba(56, 189, 248, 0.18)' },
    { x: width * 0.5, y: height * 0.8, vx: 0.18, vy: -0.2, r: 400, color: 'rgba(99, 102, 241, 0.2)' },
    { x: width * 0.85, y: height * 0.85, vx: -0.22, vy: -0.18, r: 350, color: 'rgba(16, 185, 129, 0.16)' }
  ];

  let mouse = { x: width / 2, y: height / 2 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function renderAmbient() {
    ctx.clearRect(0, 0, width, height);

    blobs.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -100 || b.x > width + 100) b.vx *= -1;
      if (b.y < -100 || b.y > height + 100) b.vy *= -1;

      const dx = mouse.x - b.x;
      const dy = mouse.y - b.y;
      b.x += dx * 0.0006;
      b.y += dy * 0.0006;

      const grad = ctx.createRadialGradient(b.x, b.y, 10, b.x, b.y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(renderAmbient);
  }

  renderAmbient();
}

// ============================================================================
// 4. SEEDED PRNG & SENSOR INITIALIZATION
// ============================================================================
function pseudoRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateDeployments() {
  const rng = pseudoRandom(STATE.seed);
  STATE.nodes = [];
  STATE.baselineMetrics = null;
  STATE.isOptimized = false;

  for (let i = 0; i < STATE.numSensors; i++) {
    const x = rng() * (STATE.fieldWidth - 10) + 5;
    const y = rng() * (STATE.fieldHeight - 10) + 5;
    STATE.nodes.push({
      id: i,
      x: x,
      y: y,
      initialX: x,
      initialY: y,
      energy: 0.5,
      isCH: false,
      isLocked: (i % 6 === 0),
      sleepState: 'active'
    });
  }
  updateDutyCycleSchedule();
}

// ============================================================================
// 5. SPATIAL FORCE CALCULATION & BLINDSPOT DETECTION
// ============================================================================
function findCoverageHoles(resolution = 5.0) {
  const holes = [];
  const rsSq = STATE.sensingRadius * STATE.sensingRadius;
  const nodes = STATE.nodes;
  const gw = Math.floor(STATE.fieldWidth / resolution);
  const gh = Math.floor(STATE.fieldHeight / resolution);

  for (let gy = 0; gy <= gh; gy++) {
    const py = gy * resolution;
    for (let gx = 0; gx <= gw; gx++) {
      const px = gx * resolution;
      let covered = false;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].energy <= 0.001) continue;
        if (nodes[i].sleepState === 'sleep') continue;
        const dx = px - nodes[i].x;
        const dy = py - nodes[i].y;
        if (dx * dx + dy * dy <= rsSq) {
          covered = true;
          break;
        }
      }
      if (!covered) {
        holes.push({ x: px, y: py });
      }
    }
  }
  return holes;
}

// ============================================================================
// ENVIRONMENTAL OBSTACLE CONFIGURATIONS & REPULSION PHYSICS
// ============================================================================
const OBSTACLE_PRESETS = {
  'none': [],
  'central-lake': [
    { id: 'lake', x: 40, y: 40, w: 20, h: 20, height: 6, label: 'Central Hazard Zone' }
  ],
  'dual-walls': [
    { id: 'wall1', x: 25, y: 15, w: 10, h: 50, height: 10, label: 'Facility Structural Wall Alpha' },
    { id: 'wall2', x: 65, y: 35, w: 10, h: 50, height: 10, label: 'Facility Structural Wall Beta' }
  ],
  'corner-zones': [
    { id: 'corner1', x: 0, y: 0, w: 25, h: 25, height: 5, label: 'SW Marshland Basin' },
    { id: 'corner2', x: 75, y: 75, w: 25, h: 25, height: 5, label: 'NE Water Basin' }
  ]
};

function computeObstacleRepulsion(nx, ny, safeMargin = 16.0) {
  let totalFx = 0;
  let totalFy = 0;
  let isInsideAny = false;

  if (!STATE.obstacles || STATE.obstacles.length === 0) {
    return { fx: 0, fy: 0, isInside: false };
  }

  STATE.obstacles.forEach(obs => {
    const minX = obs.x;
    const maxX = obs.x + obs.w;
    const minY = obs.y;
    const maxY = obs.y + obs.h;

    // Check if node is strictly inside the obstacle rectangle
    if (nx >= minX && nx <= maxX && ny >= minY && ny <= maxY) {
      isInsideAny = true;
      const dLeft = nx - minX;
      const dRight = maxX - nx;
      const dBottom = ny - minY;
      const dTop = maxY - ny;

      const minEdge = Math.min(dLeft, dRight, dBottom, dTop);
      const ejectStrength = 8.5; // High emergency evacuation thrust

      if (minEdge === dLeft) totalFx -= ejectStrength;
      else if (minEdge === dRight) totalFx += ejectStrength;
      else if (minEdge === dBottom) totalFy -= ejectStrength;
      else totalFy += ejectStrength;
    } else {
      // Outside obstacle, check proximity to boundary
      const closestX = Math.max(minX, Math.min(maxX, nx));
      const closestY = Math.max(minY, Math.min(maxY, ny));
      const dx = nx - closestX;
      const dy = ny - closestY;
      const dist = Math.hypot(dx, dy);

      if (dist > 0 && dist < safeMargin) {
        const factor = (safeMargin - dist) / safeMargin;
        const mag = 4.2 * Math.pow(factor, 1.8);
        totalFx += mag * (dx / dist);
        totalFy += mag * (dy / dist);
      }
    }
  });

  return { fx: totalFx, fy: totalFy, isInside: isInsideAny };
}

// ============================================================================
// MISSION TARGETS & POINT-OF-INTEREST (POI) DYNAMICS & TRACKING
// ============================================================================
const POI_PRESETS = {
  'none': [],
  'high-value-assets': [
    { id: 'poi-hq', x: 50, y: 50, priority: 3, label: 'HQ Tactical Outpost', type: 'stationary', radius: 10 },
    { id: 'poi-depot', x: 25, y: 75, priority: 2, label: 'Primary Fuel Depot', type: 'stationary', radius: 8 },
    { id: 'poi-pump', x: 75, y: 25, priority: 2, label: 'Water Infrastructure', type: 'stationary', radius: 8 }
  ],
  'perimeter-patrol': [
    {
      id: 'poi-patrol1', x: 15, y: 15, priority: 3, label: 'Infiltration Target Alpha', type: 'patrol',
      waypoints: [{ x: 15, y: 15 }, { x: 85, y: 15 }, { x: 85, y: 85 }, { x: 15, y: 85 }],
      waypointIndex: 0, speed: 0.18
    },
    {
      id: 'poi-patrol2', x: 85, y: 85, priority: 2, label: 'Recon Incursion Beta', type: 'patrol',
      waypoints: [{ x: 85, y: 85 }, { x: 15, y: 85 }, { x: 15, y: 15 }, { x: 85, y: 15 }],
      waypointIndex: 0, speed: 0.14
    }
  ],
  'dynamic-convoy': [
    {
      id: 'poi-lead', x: 10, y: 20, priority: 3, label: 'Tactical Convoy Lead', type: 'patrol',
      waypoints: [{ x: 10, y: 20 }, { x: 45, y: 40 }, { x: 60, y: 65 }, { x: 85, y: 85 }, { x: 50, y: 50 }],
      waypointIndex: 0, speed: 0.17
    },
    {
      id: 'poi-payload', x: 16, y: 15, priority: 3, label: 'Hazardous Asset Transport', type: 'patrol',
      waypoints: [{ x: 16, y: 15 }, { x: 40, y: 34 }, { x: 54, y: 60 }, { x: 80, y: 80 }, { x: 45, y: 45 }],
      waypointIndex: 0, speed: 0.15
    },
    {
      id: 'poi-rear', x: 22, y: 10, priority: 2, label: 'Rear Guard Defense', type: 'patrol',
      waypoints: [{ x: 22, y: 10 }, { x: 35, y: 28 }, { x: 48, y: 55 }, { x: 75, y: 75 }, { x: 40, y: 40 }],
      waypointIndex: 0, speed: 0.16
    }
  ]
};

function computePoiAttraction(nx, ny, attractHorizon = 28.0) {
  let totalFx = 0;
  let totalFy = 0;
  if (!STATE.poiList || STATE.poiList.length === 0) {
    return { fx: 0, fy: 0 };
  }

  STATE.poiList.forEach(poi => {
    const dx = poi.x - nx;
    const dy = poi.y - ny;
    const dist = Math.hypot(dx, dy);

    if (dist > 0 && dist < attractHorizon) {
      const pullFactor = (attractHorizon - dist) / attractHorizon;
      const strength = (poi.priority || 2) * 1.6 * Math.pow(pullFactor, 1.4);
      totalFx += strength * (dx / dist);
      totalFy += strength * (dy / dist);
    }
  });

  return { fx: totalFx, fy: totalFy };
}

// ============================================================================
// RF ELECTRONIC JAMMING & INTERFERENCE ZONES
// ============================================================================
const JAMMER_PRESETS = {
  'none': [],
  'central-jammer': [
    { id: 'j1', x: 50, y: 55, radius: 22, power: 100, label: 'Central High-Power Jammer' }
  ],
  'dual-jammers': [
    { id: 'j1', x: 30, y: 45, radius: 16, power: 80, label: 'Sector-Alpha Jammer' },
    { id: 'j2', x: 70, y: 65, radius: 16, power: 80, label: 'Sector-Beta Jammer' }
  ]
};

function checkJammerInterference(x1, y1, x2, y2) {
  if (!STATE.jammers || STATE.jammers.length === 0) return null;
  for (const jam of STATE.jammers) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    let t = 0;
    if (lenSq > 0.0001) {
      t = Math.max(0, Math.min(1, ((jam.x - x1) * dx + (jam.y - y1) * dy) / lenSq));
    }
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    const distToJammer = Math.hypot(projX - jam.x, projY - jam.y);
    if (distToJammer <= jam.radius) {
      return jam;
    }
  }
  return null;
}

function updatePoiTrackingMetrics() {
  const badge = document.getElementById('poi-status-badge');
  if (!STATE.poiList || STATE.poiList.length === 0) {
    STATE.poiMetrics = { trackedCount: 0, totalCount: 0, trackingRatio: 100, avgSensorsPerTarget: 0 };
    if (badge) {
      badge.textContent = 'Inactive';
      badge.className = 'badge-mini badge-cyan';
    }
    return;
  }

  const total = STATE.poiList.length;
  let tracked = 0;
  let totalCoveringSensors = 0;

  STATE.poiList.forEach(poi => {
    let coveringSensors = 0;
    STATE.nodes.forEach(node => {
      if (node.energy > 0.001) {
        const d = Math.hypot(node.x - poi.x, node.y - poi.y);
        if (d <= STATE.sensingRadius) coveringSensors++;
      }
    });
    poi.coveringSensors = coveringSensors;
    poi.isTracked = coveringSensors > 0;
    if (poi.isTracked) tracked++;
    totalCoveringSensors += coveringSensors;
  });

  const ratio = Math.round((tracked / total) * 100);
  const avg = (totalCoveringSensors / total).toFixed(1);
  STATE.poiMetrics = {
    trackedCount: tracked,
    totalCount: total,
    trackingRatio: ratio,
    avgSensorsPerTarget: parseFloat(avg)
  };

  if (badge) {
    if (tracked === total) {
      badge.textContent = `🎯 ${tracked}/${total} (100%)`;
      badge.className = 'badge-mini badge-emerald';
    } else {
      badge.textContent = `⚠️ ${tracked}/${total} (${ratio}%)`;
      badge.className = 'badge-mini badge-amber';
    }
  }
}

function updateDutyCycleSchedule() {
  const badge = document.getElementById('duty-cycle-badge');

  if (STATE.dutyCycleMode === 'none') {
    STATE.nodes.forEach(n => {
      if (n.energy > 0.001) n.sleepState = 'active';
      else n.sleepState = 'dead';
    });
    const awakeCount = STATE.nodes.filter(n => n.sleepState === 'active').length;
    STATE.dutyCycleMetrics = { awakeCount, sleepCount: 0, deadCount: STATE.nodes.length - awakeCount, harvestedJoules: 0 };
    if (badge) {
      badge.textContent = `${awakeCount} Active (100%)`;
      badge.className = 'badge-mini badge-cyan';
    }
    return;
  }

  const activeNodes = STATE.nodes.filter(node => node.energy > 0.001);
  activeNodes.forEach(node => { node.sleepState = 'active'; });

  // Redundancy degree evaluation
  activeNodes.forEach(node => {
    let neighborsInCover = 0;
    activeNodes.forEach(other => {
      if (node.id !== other.id) {
        const d = Math.hypot(node.x - other.x, node.y - other.y);
        if (d <= STATE.sensingRadius * 1.35) neighborsInCover++;
      }
    });
    node.redundancyDegree = neighborsInCover;
  });

  const candidates = [...activeNodes]
    .filter(node => !node.isCH && node.redundancyDegree >= 2)
    .sort((a, b) => b.redundancyDegree - a.redundancyDegree);

  const maxSleepNodes = Math.floor(activeNodes.length * 0.38);
  let sleepingNodesCount = 0;

  for (const cand of candidates) {
    if (sleepingNodesCount >= maxSleepNodes) break;

    const coveredByAwake = activeNodes.some(other =>
      other.id !== cand.id &&
      other.sleepState === 'active' &&
      Math.hypot(cand.x - other.x, cand.y - other.y) <= STATE.sensingRadius * 1.1
    );

    if (coveredByAwake) {
      cand.sleepState = 'sleep';
      sleepingNodesCount++;
    }
  }

  let awake = 0, sleep = 0, dead = 0;
  STATE.nodes.forEach(node => {
    if (node.energy <= 0.001) { node.sleepState = 'dead'; dead++; }
    else if (node.sleepState === 'sleep') sleep++;
    else awake++;
  });

  STATE.dutyCycleMetrics = {
    awakeCount: awake,
    sleepCount: sleep,
    deadCount: dead,
    harvestedJoules: STATE.dutyCycleMetrics ? STATE.dutyCycleMetrics.harvestedJoules : 0
  };

  if (badge) {
    const isHarvesting = (STATE.dutyCycleMode === 'harvesting-duty-cycle');
    badge.textContent = `⚡ ${awake} Awake | 💤 ${sleep} Sleep${isHarvesting ? ' (☀️)' : ''}`;
    badge.className = 'badge-mini badge-indigo';
  }
}

function runRealTimeOptimizationStep(algo = 'ea-vvf-mopso', step = 0, maxSteps = 30) {
  const nodes = STATE.nodes;
  const n = nodes.length;
  const thresholdDist = 2.0 * STATE.sensingRadius;
  const forces = Array.from({ length: n }, () => ({ fx: 0, fy: 0 }));

  // 1. Inter-Sensor Repulsive Forces
  for (let i = 0; i < n; i++) {
    if (algo === 'ea-vvf-mopso' && nodes[i].isLocked) continue;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0 && dist < thresholdDist) {
        const overlapFactor = (thresholdDist - dist) / thresholdDist;
        const surge = dist < STATE.sensingRadius ? 4.0 : 2.2;
        const fMag = surge * Math.pow(overlapFactor, 1.7);
        const angle = Math.atan2(dy, dx);
        forces[i].fx += fMag * Math.cos(angle);
        forces[i].fy += fMag * Math.sin(angle);
      }
    }
  }

  // 2. Algorithm-Specific Attractive Forces toward Unmonitored Blindspots / Centers
  if (algo === 'ea-vvf-mopso' || algo === 'vfa' || algo === 'pso' || algo === 'mopso' || algo === 'ga') {
    const holes = findCoverageHoles(6.0);
    if (holes.length > 0) {
      for (let i = 0; i < n; i++) {
        if (algo === 'ea-vvf-mopso' && nodes[i].isLocked) continue;
        let nearestHoles = holes
          .map(h => ({ ...h, d: Math.hypot(h.x - nodes[i].x, h.y - nodes[i].y) }))
          .filter(h => h.d > STATE.sensingRadius && h.d < thresholdDist * 2.5)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3);

        for (const h of nearestHoles) {
          const dx = h.x - nodes[i].x;
          const dy = h.y - nodes[i].y;
          const dist = Math.hypot(dx, dy);
          const pullWeight = (algo === 'vfa' ? 1.6 : (algo === 'ea-vvf-mopso' ? 1.3 : 1.0));
          const pullMag = pullWeight * (dist / (thresholdDist * 2.5));
          const angle = Math.atan2(dy, dx);
          forces[i].fx += pullMag * Math.cos(angle);
          forces[i].fy += pullMag * Math.sin(angle);
        }
      }
    }
  } else if (algo === 'voronoi') {
    // Centroidal Voronoi relaxation: each sensor relaxes towards centroid of local neighborhood
    for (let i = 0; i < n; i++) {
      let sumX = 0, sumY = 0, count = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < thresholdDist * 1.5) {
          sumX += nodes[j].x;
          sumY += nodes[j].y;
          count++;
        }
      }
      if (count > 0) {
        const cx = sumX / count;
        const cy = sumY / count;
        const dx = nodes[i].x - cx;
        const dy = nodes[i].y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.1) {
          forces[i].fx += 1.8 * (dx / dist);
          forces[i].fy += 1.8 * (dy / dist);
        }
      }
    }
  }

  // 3. Boundary Repulsion
  const boundaryMargin = STATE.sensingRadius * 0.9;
  for (let i = 0; i < n; i++) {
    if (algo === 'ea-vvf-mopso' && nodes[i].isLocked) continue;
    if (nodes[i].x < boundaryMargin) {
      forces[i].fx += 3.0 * ((boundaryMargin - nodes[i].x) / boundaryMargin);
    } else if (nodes[i].x > STATE.fieldWidth - boundaryMargin) {
      forces[i].fx -= 3.0 * ((nodes[i].x - (STATE.fieldWidth - boundaryMargin)) / boundaryMargin);
    }

    if (nodes[i].y < boundaryMargin) {
      forces[i].fy += 3.0 * ((boundaryMargin - nodes[i].y) / boundaryMargin);
    } else if (nodes[i].y > STATE.fieldHeight - boundaryMargin) {
      forces[i].fy -= 3.0 * ((nodes[i].y - (STATE.fieldHeight - boundaryMargin)) / boundaryMargin);
    }
  }

  // 3.5 Physical Obstacle Boundary Repulsion
  if (STATE.obstacles && STATE.obstacles.length > 0) {
    const obsSafeMargin = STATE.sensingRadius * 1.2;
    for (let i = 0; i < n; i++) {
      const rep = computeObstacleRepulsion(nodes[i].x, nodes[i].y, obsSafeMargin);
      forces[i].fx += rep.fx;
      forces[i].fy += rep.fy;
    }
  }

  // 3.6 Mission Targets / POI Virtual Attraction Force
  if (STATE.poiList && STATE.poiList.length > 0) {
    const attractHorizon = STATE.sensingRadius * 1.8;
    for (let i = 0; i < n; i++) {
      if (algo === 'ea-vvf-mopso' && nodes[i].isLocked) continue;
      const poiF = computePoiAttraction(nodes[i].x, nodes[i].y, attractHorizon);
      forces[i].fx += poiF.fx;
      forces[i].fy += poiF.fy;
    }
  }

  // 4. Physical Position Update with Convergence Damping
  const decay = 1.0 - (0.4 * (step / Math.max(1, maxSteps)));
  let baseStep = 1.5;
  if (algo === 'ea-vvf-mopso') baseStep = 1.6;
  else if (algo === 'vfa') baseStep = 2.0;
  else if (algo === 'voronoi') baseStep = 1.5;
  else if (algo === 'ga') baseStep = 1.2;
  else baseStep = 1.4;

  const stepSize = baseStep * decay;

  for (let i = 0; i < n; i++) {
    if (algo === 'ea-vvf-mopso' && nodes[i].isLocked) continue;
    const fTotal = Math.hypot(forces[i].fx, forces[i].fy);
    if (fTotal > 0.05) {
      const dx = Math.max(-stepSize, Math.min(stepSize, forces[i].fx * 0.35));
      const dy = Math.max(-stepSize, Math.min(stepSize, forces[i].fy * 0.35));
      nodes[i].x = Math.max(3, Math.min(STATE.fieldWidth - 3, nodes[i].x + dx));
      nodes[i].y = Math.max(3, Math.min(STATE.fieldHeight - 3, nodes[i].y + dy));
    }
  }
}

// ============================================================================
// 6. THREE.JS 3D SCENE & PARALLAX MOTION THEME
// ============================================================================
let scene, camera, renderer;
let nodeGroup, diskGroup, linkGroup, routingBeamGroup, packetGroup, dustParticlesGroup, obstacleGroup, poiGroup, jammerGroup, empShockwaveGroup;
let baseStationMesh, radarRingMesh, shockwaveMesh;
let isDragging = false, prevMousePos = { x: 0, y: 0 };
let raycaster, mouseNorm, hoveredNodeId = null;

// Parallax & Smooth Camera Targets
const cameraTarget = {
  pos: new THREE.Vector3(50, -110, 130),
  lookAt: new THREE.Vector3(50, 50, 0)
};
const currentLookAt = new THREE.Vector3(50, 50, 0);
const parallaxOffset = new THREE.Vector2(0, 0);

// Active Flying Packet System
let activePackets = [];

function initThreeScene() {
  const container = document.getElementById('threejs-canvas-container');
  if (!container) return;

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 600;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060709);
  scene.fog = new THREE.FogExp2(0x060709, 0.0028);

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1200);
  camera.position.set(50, -110, 130);
  camera.lookAt(50, 50, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  // Precision Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x38BDF8, 1.2);
  dirLight1.position.set(100, -60, 140);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x6366F1, 0.8);
  dirLight2.position.set(-60, 160, 90);
  scene.add(dirLight2);

  const sinkPointLight = new THREE.PointLight(0xF43F5E, 2.0, 180);
  sinkPointLight.position.set(50, 135, 18);
  scene.add(sinkPointLight);

  // 1. Matte Dark Grid & Terrain
  const gridHelper = new THREE.GridHelper(100, 20, 0x1E293B, 0x0F172A);
  gridHelper.position.set(50, 50, -0.4);
  gridHelper.rotation.x = Math.PI / 2;
  scene.add(gridHelper);

  const planeGeo = new THREE.PlaneGeometry(100, 100);
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0x0A0D15,
    roughness: 0.4,
    metalness: 0.7,
    transparent: true,
    opacity: 0.95
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.position.set(50, 50, -0.7);
  scene.add(plane);

  // Precise Outer Border
  const borderGeo = new THREE.BoxGeometry(100, 100, 1.0);
  const borderMat = new THREE.MeshBasicMaterial({ color: 0x1E293B, wireframe: true });
  const borderBox = new THREE.Mesh(borderGeo, borderMat);
  borderBox.position.set(50, 50, 0);
  scene.add(borderBox);

  // Animated Radar Sonar Ring
  const radarGeo = new THREE.RingGeometry(0.5, 2.0, 48);
  const radarMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });
  radarRingMesh = new THREE.Mesh(radarGeo, radarMat);
  radarRingMesh.position.set(50, 50, -0.3);
  scene.add(radarRingMesh);

  // 2. Atmospheric Ambient Dust Particles
  createAmbientDustParticles();

  // 3. Base Station Tower Model at (50, 135, 0)
  createBaseStation();

  // 4. Mesh Groups
  nodeGroup = new THREE.Group();
  diskGroup = new THREE.Group();
  linkGroup = new THREE.Group();
  routingBeamGroup = new THREE.Group();
  packetGroup = new THREE.Group();
  obstacleGroup = new THREE.Group();
  poiGroup = new THREE.Group();
  jammerGroup = new THREE.Group();
  empShockwaveGroup = new THREE.Group();

  scene.add(obstacleGroup);
  scene.add(poiGroup);
  scene.add(jammerGroup);
  scene.add(empShockwaveGroup);
  scene.add(diskGroup);
  scene.add(linkGroup);
  scene.add(routingBeamGroup);
  scene.add(nodeGroup);
  scene.add(packetGroup);

  rebuildSceneMeshes();

  // Raycaster & Mouse setup
  raycaster = new THREE.Raycaster();
  mouseNorm = new THREE.Vector2(-999, -999);
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const dragBadge = document.getElementById('drag-coord-badge');

  function getFieldCoordsFromRay(e) {
    const rect = container.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x: mx, y: my }, camera);
    const target = new THREE.Vector3();
    const hit = raycaster.ray.intersectPlane(groundPlane, target);
    if (hit) {
      return {
        x: Math.max(2, Math.min(STATE.fieldWidth - 2, target.x)),
        y: Math.max(2, Math.min(STATE.fieldHeight - 2, target.y))
      };
    }
    return null;
  }

  // Mouse Interaction (Orbit control + Raycast + Direct Manipulation)
  container.addEventListener('mousedown', (e) => {
    const coords = getFieldCoordsFromRay(e);

    if (STATE.interactionMode === 'drag') {
      if (coords) {
        let closest = null;
        let minDist = 5.5;
        STATE.nodes.forEach(n => {
          const d = Math.hypot(n.x - coords.x, n.y - coords.y);
          if (d < minDist) { minDist = d; closest = n; }
        });
        if (closest) {
          STATE.draggedNode = closest;
          container.style.cursor = 'grabbing';
          if (dragBadge) {
            dragBadge.style.display = 'block';
            dragBadge.innerHTML = `<span>✋ Relocating Node #${closest.id}: (${closest.x.toFixed(1)}m, ${closest.y.toFixed(1)}m)</span>`;
          }
          SFX.click();
          return;
        }
      }
    } else if (STATE.interactionMode === 'inject') {
      if (coords) {
        const rep = computeObstacleRepulsion(coords.x, coords.y, 1.0);
        if (rep.isInside) {
          showToast('⚠️ Cannot deploy sensor inside a restricted hazard zone!');
          return;
        }
        injectCustomSensor(coords.x, coords.y);
        return;
      }
    } else if (STATE.interactionMode === 'delete') {
      if (coords) {
        let closest = null;
        let minDist = 4.5;
        STATE.nodes.forEach(n => {
          const d = Math.hypot(n.x - coords.x, n.y - coords.y);
          if (d < minDist) { minDist = d; closest = n; }
        });
        if (closest) {
          decommissionSensor(closest.id);
          return;
        }
      }
    }

    // Default inspect & orbit drag
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
    STATE.isOrbitCam = false;
    updateOrbitButtonUI();
  });

  window.addEventListener('mouseup', () => {
    if (STATE.draggedNode) {
      showToast(`✅ Node #${STATE.draggedNode.id} relocated to (${STATE.draggedNode.x.toFixed(1)}m, ${STATE.draggedNode.y.toFixed(1)}m)`);
      STATE.draggedNode = null;
      container.style.cursor = STATE.interactionMode === 'drag' ? 'grab' : 'default';
      SFX.click();
    }
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Subtle 3D Camera Parallax
    parallaxOffset.x = mouseNorm.x * 9.0;
    parallaxOffset.y = mouseNorm.y * 6.0;

    const coords = getFieldCoordsFromRay(e);

    if (STATE.draggedNode && coords) {
      let fx = coords.x;
      let fy = coords.y;

      if (STATE.obstacles && STATE.obstacles.length > 0) {
        const rep = computeObstacleRepulsion(fx, fy, 4.0);
        if (rep.isInside) {
          fx = Math.max(2, Math.min(STATE.fieldWidth - 2, fx + rep.fx * 1.5));
          fy = Math.max(2, Math.min(STATE.fieldHeight - 2, fy + rep.fy * 1.5));
        }
      }

      STATE.draggedNode.x = fx;
      STATE.draggedNode.y = fy;
      STATE.draggedNode.initialX = fx;
      STATE.draggedNode.initialY = fy;

      if (dragBadge) {
        dragBadge.style.display = 'block';
        dragBadge.innerHTML = `<span>✋ Relocating Node #${STATE.draggedNode.id}: (${fx.toFixed(1)}m, ${fy.toFixed(1)}m)</span>`;
      }

      rebuildSceneMeshes();
      compute2DGridMetrics();
      return;
    }

    if ((STATE.interactionMode === 'inject' || STATE.interactionMode === 'drag') && coords && dragBadge) {
      dragBadge.style.display = 'block';
      dragBadge.innerHTML = `<span>📍 Cursor: (${coords.x.toFixed(1)}m, ${coords.y.toFixed(1)}m)</span>`;
    }

    if (isDragging) {
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      cameraTarget.pos.x -= deltaX * 0.35;
      cameraTarget.pos.y += deltaY * 0.35;
      camera.position.x = cameraTarget.pos.x;
      camera.position.y = cameraTarget.pos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };
    }
  });

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.18;
    cameraTarget.pos.z = Math.max(35, Math.min(260, cameraTarget.pos.z + zoomFactor));
  });

  container.addEventListener('mouseleave', () => {
    mouseNorm.set(-999, -999);
    parallaxOffset.set(0, 0);
    hide3DTooltip();
  });

  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
}

function createAmbientDustParticles() {
  const particleCount = 180;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = Math.random() * 140 - 20;
    positions[i + 1] = Math.random() * 160 - 20;
    positions[i + 2] = Math.random() * 45 + 2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x38BDF8,
    size: 1.4,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });

  dustParticlesGroup = new THREE.Points(geometry, material);
  scene.add(dustParticlesGroup);
}

function createBaseStation() {
  const bsGroup = new THREE.Group();
  bsGroup.position.set(50, 135, 0);

  // Mast Tower Cone
  const towerGeo = new THREE.ConeGeometry(3.2, 16, 8);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    emissive: 0x0F172A,
    roughness: 0.3,
    metalness: 0.9
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.rotation.x = Math.PI / 2;
  tower.position.z = 8;
  bsGroup.add(tower);

  // High-intensity Glowing Beacon
  const sphereGeo = new THREE.SphereGeometry(2.2, 20, 20);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xFF2D55,
    emissive: 0xFF1744,
    emissiveIntensity: 1.3,
    roughness: 0.15
  });
  const beacon = new THREE.Mesh(sphereGeo, sphereMat);
  beacon.position.z = 17;
  bsGroup.add(beacon);

  // Rotating Dual-Axis Gyro Rings
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8, wireframe: true });
  const gyro1 = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.2, 8, 24), ringMat);
  gyro1.position.z = 17;
  gyro1.name = 'gyro1';
  bsGroup.add(gyro1);

  const gyro2 = new THREE.Mesh(new THREE.TorusGeometry(6.6, 0.2, 8, 24), ringMat);
  gyro2.position.z = 17;
  gyro2.name = 'gyro2';
  bsGroup.add(gyro2);

  // Shockwave Ring
  const shockGeo = new THREE.RingGeometry(1, 3.5, 32);
  const shockMat = new THREE.MeshBasicMaterial({
    color: 0xFF2D55,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide
  });
  shockwaveMesh = new THREE.Mesh(shockGeo, shockMat);
  shockwaveMesh.position.z = 17;
  bsGroup.add(shockwaveMesh);

  // Upward Volumetric Telemetry Beam
  const beamGeo = new THREE.CylinderGeometry(0.2, 2.0, 75, 16, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xF43F5E,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  });
  const skyBeam = new THREE.Mesh(beamGeo, beamMat);
  skyBeam.rotation.x = Math.PI / 2;
  skyBeam.position.z = 54;
  bsGroup.add(skyBeam);

  baseStationMesh = bsGroup;
  scene.add(baseStationMesh);
}

function rebuildObstacleMeshes() {
  if (!obstacleGroup) return;
  while (obstacleGroup.children.length) obstacleGroup.remove(obstacleGroup.children[0]);

  if (!STATE.obstacles || STATE.obstacles.length === 0) return;

  STATE.obstacles.forEach((obs) => {
    const obsContainer = new THREE.Group();
    const obsHeight = obs.height || 7;
    const boxGeo = new THREE.BoxGeometry(obs.w, obs.h, obsHeight);

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xF43F5E,
      emissive: 0x991B1B,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.38,
      roughness: 0.15,
      metalness: 0.8
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.set(obs.x + obs.w / 2, obs.y + obs.h / 2, obsHeight / 2);
    obsContainer.add(boxMesh);

    const edges = new THREE.EdgesGeometry(boxGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xFDA4AF,
      transparent: true,
      opacity: 0.9,
      linewidth: 2
    });
    const edgeWire = new THREE.LineSegments(edges, edgeMat);
    edgeWire.position.copy(boxMesh.position);
    obsContainer.add(edgeWire);

    const beaconGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xF43F5E });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(obs.x + obs.w / 2, obs.y + obs.h / 2, obsHeight + 0.5);
    beacon.rotation.x = Math.PI / 2;
    obsContainer.add(beacon);

    obstacleGroup.add(obsContainer);
  });
}

function rebuildPoiMeshes() {
  if (!poiGroup) return;
  while (poiGroup.children.length) poiGroup.remove(poiGroup.children[0]);

  if (!STATE.poiList || STATE.poiList.length === 0) return;

  STATE.poiList.forEach((poi, idx) => {
    const poiContainer = new THREE.Group();
    poiContainer.position.set(poi.x, poi.y, 0);
    poiContainer.userData = { idx, id: poi.id, priority: poi.priority };

    // 1. Holographic diamond / octahedron mesh
    const diamondGeo = new THREE.OctahedronGeometry(2.0, 0);
    const colorHex = poi.priority === 3 ? 0xFBBF24 : (poi.priority === 2 ? 0x38BDF8 : 0xA855F7);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.65,
      roughness: 0.1,
      metalness: 0.9
    });
    const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
    diamondMesh.name = 'diamond';
    diamondMesh.position.set(0, 0, 4.5);
    poiContainer.add(diamondMesh);

    // Wireframe cage
    const cageGeo = new THREE.WireframeGeometry(diamondGeo);
    const cageMat = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.8 });
    const cageMesh = new THREE.LineSegments(cageGeo, cageMat);
    diamondMesh.add(cageMesh);

    // 2. Vertical beacon beam
    const beamGeo = new THREE.CylinderGeometry(0.12, 0.28, 8.0, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.45
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, 0, 4.0);
    beamMesh.rotation.x = Math.PI / 2;
    poiContainer.add(beamMesh);

    // 3. Ground target reticle ring
    const reticleGeo = new THREE.RingGeometry(1.4, 1.9, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.position.set(0, 0, 0.1);
    poiContainer.add(reticleMesh);

    // 4. Dynamic expanding sonar wave ring
    const sonarGeo = new THREE.RingGeometry(2.0, 2.6, 32);
    const sonarMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const sonarMesh = new THREE.Mesh(sonarGeo, sonarMat);
    sonarMesh.name = 'sonarRing';
    sonarMesh.position.set(0, 0, 0.12);
    poiContainer.add(sonarMesh);

    poiGroup.add(poiContainer);
  });
}

function rebuildJammerMeshes() {
  if (!jammerGroup) return;
  while (jammerGroup.children.length) jammerGroup.remove(jammerGroup.children[0]);
  if (!STATE.jammers || STATE.jammers.length === 0) return;

  STATE.jammers.forEach(jam => {
    const jamContainer = new THREE.Group();
    jamContainer.position.set(jam.x, jam.y, 0);

    // 1. Hemispherical Wireframe Distortion Dome
    const domeGeo = new THREE.SphereGeometry(jam.radius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0xE11D48,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.rotation.x = Math.PI / 2;
    domeMesh.name = 'jammerDome';
    jamContainer.add(domeMesh);

    // 2. Inner Translucent Energy Core
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xE11D48,
      emissive: 0x991B1B,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.08,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const innerDome = new THREE.Mesh(domeGeo, coreMat);
    innerDome.rotation.x = Math.PI / 2;
    jamContainer.add(innerDome);

    // 3. Central Antenna Tower Mast
    const mastGeo = new THREE.CylinderGeometry(0.5, 0.9, 10, 8);
    const mastMat = new THREE.MeshStandardMaterial({
      color: 0x1E1B4B,
      metalness: 0.9,
      roughness: 0.2
    });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.rotation.x = Math.PI / 2;
    mast.position.z = 5;
    jamContainer.add(mast);

    // 4. Strobe Beacon on top of mast
    const beaconGeo = new THREE.SphereGeometry(1.0, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xF43F5E });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.z = 10.2;
    jamContainer.add(beacon);

    // 5. Perimeter Ground Warning Ring
    const ringGeo = new THREE.RingGeometry(jam.radius - 0.5, jam.radius + 0.3, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xF43F5E,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    jamContainer.add(ring);

    jammerGroup.add(jamContainer);
  });
}

function createEmpShockwave(x, y, radius) {
  if (!empShockwaveGroup) return;
  const shockGeo = new THREE.RingGeometry(1, 3.5, 48);
  const shockMat = new THREE.MeshBasicMaterial({
    color: 0xF43F5E,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide
  });
  const shockMesh = new THREE.Mesh(shockGeo, shockMat);
  shockMesh.position.set(x, y, 0.5);
  shockMesh.userData = { maxScale: radius / 3.5 };
  empShockwaveGroup.add(shockMesh);
}

function rebuildSceneMeshes() {
  if (!nodeGroup) return;

  while (nodeGroup.children.length) nodeGroup.remove(nodeGroup.children[0]);
  while (diskGroup.children.length) diskGroup.remove(diskGroup.children[0]);
  while (linkGroup.children.length) linkGroup.remove(linkGroup.children[0]);

  rebuildObstacleMeshes();
  rebuildPoiMeshes();
  rebuildJammerMeshes();

  const nodes = STATE.nodes;
  const sphereGeo = new THREE.SphereGeometry(STATE.sensingRadius, 24, 16);

  nodes.forEach((node) => {
    const isAlive = (node.energy > 0.001);
    const isSleeping = (node.sleepState === 'sleep');

    // 1. Translucent Sensing Disks
    if (isAlive && STATE.showBubbles) {
      const diskMat = new THREE.MeshStandardMaterial({
        color: node.isCH ? 0xFBBF24 : (isSleeping ? 0x818CF8 : (STATE.isOptimized ? 0x10B981 : 0x38BDF8)),
        transparent: true,
        opacity: isSleeping ? 0.03 : (node.isCH ? 0.2 : 0.11),
        roughness: 0.15,
        metalness: 0.2
      });
      const disk = new THREE.Mesh(sphereGeo, diskMat);
      disk.position.set(node.x, node.y, 0);
      disk.userData = { nodeId: node.id, isDisk: true };
      diskGroup.add(disk);
    }

    // 2. Precision Industrial Sensor Hardware Puck
    const nodeContainer = new THREE.Group();
    nodeContainer.position.set(node.x, node.y, 1.6);
    nodeContainer.userData = { nodeId: node.id, isNode: true };

    let coreColor = 0x38BDF8;
    let emissiveColor = 0x0284C7;
    let emissiveIntensity = 0.8;

    if (!isAlive) {
      coreColor = 0x1E2433;
      emissiveColor = 0x000000;
      emissiveIntensity = 0.0;
    } else if (isSleeping) {
      coreColor = 0x64748B; // Muted Sleeping Slate
      emissiveColor = 0x334155;
      emissiveIntensity = 0.22;
    } else if (node.isCH) {
      coreColor = 0xFBBF24; // Cluster Head Gold
      emissiveColor = 0xF59E0B;
      emissiveIntensity = 1.3;
    } else if (node.isLocked) {
      coreColor = 0xF59E0B; // Energy Guard
      emissiveColor = 0xD97706;
      emissiveIntensity = 0.85;
    } else if (STATE.isOptimized) {
      coreColor = 0x10B981; // Optimized Emerald
      emissiveColor = 0x059669;
      emissiveIntensity = 0.8;
    }

    // Cylindrical Puck Base
    const shellGeo = new THREE.CylinderGeometry(1.6, 2.0, 1.1, 16);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x131722,
      metalness: 0.9,
      roughness: 0.2
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.rotation.x = Math.PI / 2;
    nodeContainer.add(shell);

    // Glowing Sensor Optical Core
    const coreGeo = new THREE.SphereGeometry(1.15, 16, 12);
    const coreMat = new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: emissiveColor,
      emissiveIntensity: emissiveIntensity,
      roughness: 0.2,
      metalness: 0.3
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.z = 0.5;
    nodeContainer.add(core);

    // Cluster Head Beacon Ring
    if (node.isCH) {
      const haloGeo = new THREE.TorusGeometry(2.8, 0.18, 8, 24);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24, wireframe: true });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.name = 'chHalo';
      halo.position.z = 1.2;
      nodeContainer.add(halo);
    }

    // Micro Status Ring (Battery status)
    if (isAlive) {
      const battRatio = node.energy / 0.50;
      let haloColor = 0x10B981;
      if (battRatio < 0.3) haloColor = 0xF43F5E;
      else if (battRatio < 0.6) haloColor = 0xFBBF24;

      const battGeo = new THREE.RingGeometry(1.6, 1.95, 16);
      const battMat = new THREE.MeshBasicMaterial({
        color: haloColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const battRing = new THREE.Mesh(battGeo, battMat);
      battRing.position.z = 1.7;
      nodeContainer.add(battRing);
    }

    // Sleep Indicator Ring
    if (isSleeping) {
      const sleepGeo = new THREE.RingGeometry(2.1, 2.4, 16);
      const sleepMat = new THREE.MeshBasicMaterial({
        color: 0x818CF8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const sleepRing = new THREE.Mesh(sleepGeo, sleepMat);
      sleepRing.position.z = 1.9;
      nodeContainer.add(sleepRing);
    }

    nodeGroup.add(nodeContainer);
  });

  // 3. Communication Link Graph
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x1E293B,
    transparent: true,
    opacity: 0.35
  });

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].energy <= 0.001) continue;
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[j].energy <= 0.001) continue;
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d <= STATE.commRadius) {
        const points = [
          new THREE.Vector3(nodes[i].x, nodes[i].y, 1.6),
          new THREE.Vector3(nodes[j].x, nodes[j].y, 1.6)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        linkGroup.add(line);
      }
    }
  }
}

// Kinetic Particle Packet Stream
function spawnFlyingPacket(fromX, fromY, fromZ, toX, toY, toZ, colorHex = 0x38BDF8) {
  if (!packetGroup) return;

  const pGeo = new THREE.SphereGeometry(0.75, 8, 8);
  const pMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.95
  });
  const pMesh = new THREE.Mesh(pGeo, pMat);
  pMesh.position.set(fromX, fromY, fromZ);
  packetGroup.add(pMesh);

  activePackets.push({
    mesh: pMesh,
    start: new THREE.Vector3(fromX, fromY, fromZ),
    end: new THREE.Vector3(toX, toY, toZ),
    progress: 0,
    speed: 0.07 + Math.random() * 0.02
  });
}

function updateFlyingPackets() {
  for (let i = activePackets.length - 1; i >= 0; i--) {
    const p = activePackets[i];
    p.progress += p.speed;

    if (p.progress >= 1.0) {
      packetGroup.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      activePackets.splice(i, 1);
    } else {
      p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      p.mesh.scale.setScalar(1.0 + 0.25 * Math.sin(p.progress * Math.PI));
    }
  }
}

function triggerBaseStationPulse() {
  if (!shockwaveMesh) return;
  shockwaveMesh.scale.set(1, 1, 1);
  shockwaveMesh.material.opacity = 0.85;
}

function updatePoiDynamics(time) {
  if (!STATE.poiList || STATE.poiList.length === 0) return;

  // 1. Holographic Diamond & Sonar Ring Pulsing
  if (poiGroup && poiGroup.children.length > 0) {
    poiGroup.children.forEach((pc) => {
      const diamond = pc.getObjectByName('diamond');
      if (diamond) {
        diamond.rotation.z += 0.035;
        diamond.rotation.y += 0.02;
        diamond.position.z = 4.5 + Math.sin(time * 3 + (pc.userData.idx || 0)) * 0.4;
      }
      const sonarRing = pc.getObjectByName('sonarRing');
      if (sonarRing) {
        const ringProgress = ((Date.now() + (pc.userData.idx || 0) * 450) % 2200) / 2200;
        const scale = 1.0 + ringProgress * 2.8;
        sonarRing.scale.set(scale, scale, 1);
        sonarRing.material.opacity = Math.max(0, 0.65 - ringProgress * 0.65);
      }
    });
  }

  // 2. Mobile Patrol Kinematics
  let anyMobileMoved = false;
  STATE.poiList.forEach((poi, idx) => {
    if (poi.type === 'patrol' && poi.waypoints && poi.waypoints.length > 0) {
      const targetWp = poi.waypoints[poi.waypointIndex];
      const dx = targetWp.x - poi.x;
      const dy = targetWp.y - poi.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 1.2) {
        poi.waypointIndex = (poi.waypointIndex + 1) % poi.waypoints.length;
      } else {
        const speed = poi.speed || 0.15;
        poi.x += (dx / dist) * speed;
        poi.y += (dy / dist) * speed;
        anyMobileMoved = true;
      }

      if (poiGroup && poiGroup.children[idx]) {
        poiGroup.children[idx].position.set(poi.x, poi.y, 0);
      }
    }
  });

  updatePoiTrackingMetrics();

  // If mobile units moved and user is on a 2D canvas tab, refresh 2D view
  if (anyMobileMoved && (STATE.activeTab === '2d-heatmap' || STATE.activeTab === '2d-voronoi')) {
    if (STATE.activeTab === '2d-heatmap') draw2DHeatmap();
    else draw2DVoronoi();
  }
}

// ============================================================================
// 7. MAIN ANIMATION & PARALLAX RENDER LOOP
// ============================================================================
let orbitAngle = 0;

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Radar Grid Wave
  if (radarRingMesh) {
    const radarScale = 1 + ((Date.now() % 3500) / 3500) * 35;
    radarRingMesh.scale.set(radarScale, radarScale, 1);
    radarRingMesh.material.opacity = Math.max(0, 0.45 - (radarScale / 36) * 0.45);
  }

  // Base Station Gyros & Beacon Pulse
  if (baseStationMesh) {
    const gyro1 = baseStationMesh.getObjectByName('gyro1');
    const gyro2 = baseStationMesh.getObjectByName('gyro2');
    if (gyro1) gyro1.rotation.z += 0.025;
    if (gyro2) gyro2.rotation.y += 0.02;

    const beaconScale = 1 + 0.12 * Math.sin(time * 5);
    if (baseStationMesh.children[1]) {
      baseStationMesh.children[1].scale.set(beaconScale, beaconScale, beaconScale);
    }
  }

  if (shockwaveMesh && shockwaveMesh.material.opacity > 0.01) {
    shockwaveMesh.scale.multiplyScalar(1.06);
    shockwaveMesh.material.opacity *= 0.92;
  }

  // Sensor Node Sinusoidal Floating & CH Halo Rotation
  if (nodeGroup && nodeGroup.children.length > 0) {
    nodeGroup.children.forEach((nc, idx) => {
      nc.position.z = 1.6 + Math.sin(time * 2.5 + idx * 0.7) * 0.28;
      const halo = nc.getObjectByName('chHalo');
      if (halo) halo.rotation.z += 0.04;
    });
  }

  // Sensing Bubbles Breathing Scale
  if (diskGroup && diskGroup.children.length > 0 && STATE.showBubbles) {
    diskGroup.children.forEach((disk, idx) => {
      const breath = 1.0 + 0.018 * Math.sin(time * 2.2 + idx * 0.5);
      disk.scale.set(breath, breath, 0.15 * breath);
    });
  }

  if (dustParticlesGroup) {
    dustParticlesGroup.rotation.z = time * 0.015;
  }

  // RF Jammer Wireframe Rotation & Ambient Energy Pulsing
  if (jammerGroup && jammerGroup.children.length > 0) {
    jammerGroup.children.forEach((jc, idx) => {
      const dome = jc.getObjectByName('jammerDome');
      if (dome) dome.rotation.z += 0.012;
      const pulse = 1.0 + 0.035 * Math.sin(time * 3.5 + idx);
      jc.scale.set(pulse, pulse, 1.0);
    });
  }

  // EMP Blast Expanding Shockwave Ring
  if (empShockwaveGroup && empShockwaveGroup.children.length > 0) {
    for (let i = empShockwaveGroup.children.length - 1; i >= 0; i--) {
      const sw = empShockwaveGroup.children[i];
      sw.scale.multiplyScalar(1.08);
      sw.material.opacity *= 0.91;
      if (sw.material.opacity < 0.01) {
        empShockwaveGroup.remove(sw);
      }
    }
  }

  updateFlyingPackets();
  updatePoiDynamics(time);

  // 360° Cinematic Orbit
  if (STATE.isOrbitCam) {
    orbitAngle += 0.0035;
    const radius = 135;
    cameraTarget.pos.x = 50 + radius * Math.cos(orbitAngle);
    cameraTarget.pos.y = 50 + radius * Math.sin(orbitAngle);
    cameraTarget.pos.z = 110 + 15 * Math.sin(orbitAngle * 0.5);
    cameraTarget.lookAt.set(50, 50, 0);
  }

  // Apply Camera Lerp with Parallax Mouse Deflection
  const targetX = cameraTarget.pos.x + (!STATE.isOrbitCam ? parallaxOffset.x : 0);
  const targetY = cameraTarget.pos.y + (!STATE.isOrbitCam ? parallaxOffset.y : 0);
  const targetZ = cameraTarget.pos.z;

  camera.position.x += (targetX - camera.position.x) * 0.08;
  camera.position.y += (targetY - camera.position.y) * 0.08;
  camera.position.z += (targetZ - camera.position.z) * 0.08;

  currentLookAt.lerp(cameraTarget.lookAt, 0.08);
  camera.lookAt(currentLookAt);

  handleRaycastHover();

  renderer.render(scene, camera);
}

// 3D Raycasting Hover
function handleRaycastHover() {
  if (!raycaster || !camera || mouseNorm.x === -999) return;

  raycaster.setFromCamera(mouseNorm, camera);
  const intersects = raycaster.intersectObjects(nodeGroup.children, true);

  if (intersects.length > 0) {
    let topGroup = intersects[0].object;
    while (topGroup.parent && topGroup.parent !== nodeGroup) {
      topGroup = topGroup.parent;
    }

    const nId = topGroup.userData.nodeId;
    if (nId !== undefined && nId !== null) {
      show3DTooltip(nId, topGroup.position);
      hoveredNodeId = nId;
      return;
    }
  }

  hide3DTooltip();
}

function show3DTooltip(nodeId, worldPos) {
  const tooltip = document.getElementById('node-3d-tooltip');
  if (!tooltip || !camera || !renderer) return;

  const node = STATE.nodes.find(n => n.id === nodeId);
  if (!node) return;

  const screenPos = worldPos.clone().project(camera);
  const rect = renderer.domElement.getBoundingClientRect();
  const screenX = ((screenPos.x + 1) / 2) * rect.width;
  const screenY = ((-screenPos.y + 1) / 2) * rect.height;

  tooltip.style.left = `${screenX}px`;
  tooltip.style.top = `${screenY}px`;
  tooltip.style.display = 'block';

  const tId = document.getElementById('tt-node-id');
  const tRole = document.getElementById('tt-node-role');
  const tPos = document.getElementById('tt-node-pos');
  const tBatt = document.getElementById('tt-node-battery');
  const tDist = document.getElementById('tt-node-dist');
  const tRs = document.getElementById('tt-node-rs');

  const isAlive = (node.energy > 0.001);
  const dToSink = Math.hypot(node.x - 50, node.y - 135);

  if (tId) tId.innerText = `Sensor Node #${node.id}`;
  if (tPos) tPos.innerText = `(${node.x.toFixed(1)}m, ${node.y.toFixed(1)}m)`;
  if (tDist) tDist.innerText = `${dToSink.toFixed(1)}m`;
  if (tRs) tRs.innerText = `Rs = ${STATE.sensingRadius}m`;

  if (tRole) {
    tRole.className = 'tt-badge';
    if (!isAlive) {
      tRole.innerText = 'Depleted';
      tRole.classList.add('dead');
    } else if (node.isCH) {
      tRole.innerText = 'Cluster Head';
      tRole.classList.add('ch');
    } else if (node.isLocked) {
      tRole.innerText = 'Energy-Preserved Guard';
    } else {
      tRole.innerText = 'Standard Node';
    }
  }

  if (tBatt) {
    const pct = ((node.energy / 0.50) * 100).toFixed(1);
    tBatt.innerText = `${pct}% (${node.energy.toFixed(4)} J)`;
    tBatt.style.color = node.energy > 0.3 ? '#10B981' : (node.energy > 0.1 ? '#FBBF24' : '#F43F5E');
  }
}

function hide3DTooltip() {
  const tooltip = document.getElementById('node-3d-tooltip');
  if (tooltip) tooltip.style.display = 'none';
  hoveredNodeId = null;
}

// Camera Presets
window.setCameraView = function (mode) {
  SFX.click();
  STATE.isOrbitCam = false;
  updateOrbitButtonUI();

  document.querySelectorAll('.btn-ctrl').forEach(b => b.classList.remove('active'));

  if (mode === 'iso') {
    cameraTarget.pos.set(50, -110, 130);
    cameraTarget.lookAt.set(50, 50, 0);
    const btn = document.getElementById('btn-cam-iso');
    if (btn) btn.classList.add('active');
  } else if (mode === 'top') {
    cameraTarget.pos.set(50, 50, 160);
    cameraTarget.lookAt.set(50, 50, 0);
    const btn = document.getElementById('btn-cam-top');
    if (btn) btn.classList.add('active');
  } else if (mode === 'sink') {
    cameraTarget.pos.set(50, 150, 45);
    cameraTarget.lookAt.set(50, 50, 0);
    const btn = document.getElementById('btn-cam-sink');
    if (btn) btn.classList.add('active');
  }
};

window.toggleOrbitCam = function () {
  SFX.click();
  STATE.isOrbitCam = !STATE.isOrbitCam;
  updateOrbitButtonUI();
};

function updateOrbitButtonUI() {
  const btn = document.getElementById('btn-toggle-orbit');
  if (btn) {
    btn.classList.toggle('active', STATE.isOrbitCam);
  }
}

window.toggleSensingBubbles = function () {
  SFX.click();
  STATE.showBubbles = !STATE.showBubbles;
  const btn = document.getElementById('btn-toggle-bubbles');
  if (btn) btn.classList.toggle('active', STATE.showBubbles);
  rebuildSceneMeshes();
};

// ============================================================================
// 8. 2D CANVAS MATRIX & VORONOI
// ============================================================================
function compute2DGridMetrics() {
  const nodes = STATE.nodes;
  const res = 1.0;
  const gridW = Math.floor(STATE.fieldWidth / res) + 1;
  const gridH = Math.floor(STATE.fieldHeight / res) + 1;
  const totalPoints = gridW * gridH;

  let coveredCount = 0;
  let uniqueCount = 0;
  let redundantCount = 0;
  let totalCoverSum = 0;
  const countGrid = new Int32Array(totalPoints);
  const rsSq = STATE.sensingRadius * STATE.sensingRadius;

  for (let gy = 0; gy < gridH; gy++) {
    const py = gy * res;
    for (let gx = 0; gx < gridW; gx++) {
      const px = gx * res;
      let count = 0;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].energy <= 0.001) continue;
        if (nodes[i].sleepState === 'sleep') continue;
        const dx = px - nodes[i].x;
        const dy = py - nodes[i].y;
        if (dx * dx + dy * dy <= rsSq) {
          count++;
        }
      }
      const idx = gy * gridW + gx;
      countGrid[idx] = count;
      if (count > 0) {
        coveredCount++;
        totalCoverSum += count;
        if (count === 1) uniqueCount++;
        else redundantCount++;
      }
    }
  }

  const covRatio = (coveredCount / totalPoints) * 100;
  const overlapRatio = coveredCount > 0 ? (redundantCount / coveredCount) * 100 : 0;
  const holeRatio = 100 - covRatio;
  const multiplicity = coveredCount > 0 ? (totalCoverSum / coveredCount) : 0;

  STATE.metrics.coverage = covRatio;
  STATE.metrics.overlap = overlapRatio;
  STATE.metrics.holes = holeRatio;
  STATE.metrics.multiplicity = multiplicity;

  // Capture pristine baseline on initial load / scenario change
  if (!STATE.isOptimized && !STATE.baselineMetrics) {
    STATE.baselineMetrics = {
      coverage: covRatio,
      overlap: overlapRatio,
      holes: holeRatio,
      multiplicity: multiplicity
    };
  }

  updateHUDMetrics();
  draw2DHeatmap(countGrid, gridW, gridH);
  draw2DVoronoi();
}

function updateHUDMetrics() {
  const elCov = document.getElementById('hud-coverage');
  const elOvr = document.getElementById('hud-overlap');
  const elHoles = document.getElementById('hud-holes');
  const elMul = document.getElementById('hud-multiplicity');

  if (elCov) elCov.innerText = `${STATE.metrics.coverage.toFixed(2)}%`;
  if (elOvr) elOvr.innerText = `${STATE.metrics.overlap.toFixed(2)}%`;
  if (elHoles) elHoles.innerText = `${STATE.metrics.holes.toFixed(2)}%`;
  if (elMul) elMul.innerText = `${STATE.metrics.multiplicity.toFixed(2)}x`;

  const deltaCov = document.getElementById('hud-coverage-delta');
  const deltaCovWrap = document.getElementById('hud-coverage-delta-wrap');
  const deltaOvr = document.getElementById('hud-overlap-delta');
  const deltaOvrWrap = document.getElementById('hud-overlap-delta-wrap');
  const deltaHoles = document.getElementById('hud-holes-delta');
  const deltaHolesWrap = document.getElementById('hud-holes-delta-wrap');

  if (STATE.baselineMetrics) {
    const covDiff = STATE.metrics.coverage - STATE.baselineMetrics.coverage;
    const ovrDiff = STATE.metrics.overlap - STATE.baselineMetrics.overlap;
    const holeDiff = STATE.metrics.holes - STATE.baselineMetrics.holes;

    if (deltaCov) {
      if (STATE.isOptimized) {
        deltaCov.innerText = `${covDiff >= 0 ? '+' : ''}${covDiff.toFixed(2)}% vs. random baseline`;
        if (deltaCovWrap) deltaCovWrap.className = `metric-delta ${covDiff >= 0 ? 'delta-positive' : 'delta-warning'}`;
      } else {
        deltaCov.innerText = `Initial random deployment baseline`;
        if (deltaCovWrap) deltaCovWrap.className = 'metric-delta delta-neutral';
      }
    }

    if (deltaOvr) {
      if (STATE.isOptimized) {
        deltaOvr.innerText = `${ovrDiff <= 0 ? '' : '+'}${ovrDiff.toFixed(2)}% shift (${(STATE.activeAlgorithm || 'EA-VVF-MOPSO').toUpperCase()})`;
        if (deltaOvrWrap) deltaOvrWrap.className = `metric-delta ${ovrDiff <= 0 ? 'delta-positive' : 'delta-warning'}`;
      } else {
        deltaOvr.innerText = `Baseline sensing overlap`;
        if (deltaOvrWrap) deltaOvrWrap.className = 'metric-delta delta-neutral';
      }
    }

    if (deltaHoles) {
      if (STATE.isOptimized) {
        deltaHoles.innerText = `${holeDiff <= 0 ? '' : '+'}${holeDiff.toFixed(2)}% blindspots change`;
        if (deltaHolesWrap) deltaHolesWrap.className = `metric-delta ${holeDiff <= 0 ? 'delta-positive' : 'delta-warning'}`;
      } else {
        deltaHoles.innerText = `Unmonitored field blindspots`;
        if (deltaHolesWrap) deltaHolesWrap.className = 'metric-delta delta-neutral';
      }
    }
  }
}

function draw2DHeatmap(countGrid, gridW, gridH) {
  const canvas = document.getElementById('heatmap-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#07090E';
  ctx.fillRect(0, 0, w, h);

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let py = 0; py < h; py++) {
    const gy = Math.floor((1 - py / h) * (gridH - 1));
    for (let px = 0; px < w; px++) {
      const gx = Math.floor((px / w) * (gridW - 1));
      const count = countGrid[gy * gridW + gx];
      const pIdx = (py * w + px) * 4;

      if (count === 0) {
        data[pIdx] = 11; data[pIdx + 1] = 14; data[pIdx + 2] = 22; data[pIdx + 3] = 255;
      } else if (count === 1) {
        data[pIdx] = 56; data[pIdx + 1] = 189; data[pIdx + 2] = 248; data[pIdx + 3] = 255;
      } else if (count === 2) {
        data[pIdx] = 16; data[pIdx + 1] = 185; data[pIdx + 2] = 129; data[pIdx + 3] = 255;
      } else if (count === 3) {
        data[pIdx] = 245; data[pIdx + 1] = 158; data[pIdx + 2] = 11; data[pIdx + 3] = 255;
      } else {
        data[pIdx] = 244; data[pIdx + 1] = 63; data[pIdx + 2] = 94; data[pIdx + 3] = 255;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  STATE.nodes.forEach(node => {
    if (node.energy <= 0.001) return;
    const nx = (node.x / STATE.fieldWidth) * w;
    const ny = (1 - node.y / STATE.fieldHeight) * h;
    const isSleep = (node.sleepState === 'sleep');

    ctx.beginPath();
    ctx.arc(nx, ny, node.isCH ? 4.5 : (isSleep ? 2.5 : 3.0), 0, Math.PI * 2);
    ctx.fillStyle = node.isCH ? '#FBBF24' : (isSleep ? '#64748B' : '#F1F5F9');
    ctx.fill();
    ctx.strokeStyle = isSleep ? '#818CF8' : '#07090E';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  drawObstaclesOnCanvas(ctx, w, h);
  drawPoisOnCanvas(ctx, w, h);
  drawJammersOnCanvas(ctx, w, h);
}

function drawObstaclesOnCanvas(ctx, w, h) {
  if (!STATE.obstacles || STATE.obstacles.length === 0) return;
  STATE.obstacles.forEach(obs => {
    const ox = (obs.x / STATE.fieldWidth) * w;
    const oy = (1 - (obs.y + obs.h) / STATE.fieldHeight) * h;
    const ow = (obs.w / STATE.fieldWidth) * w;
    const oh = (obs.h / STATE.fieldHeight) * h;

    ctx.save();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
    ctx.fillRect(ox, oy, ow, oh);

    ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = -oh; i < ow; i += 12) {
      ctx.moveTo(ox + Math.max(0, i), oy + (i < 0 ? -i : 0));
      ctx.lineTo(ox + Math.min(ow, i + oh), oy + Math.min(oh, (ow - i)));
    }
    ctx.stroke();

    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(ox, oy, ow, oh);

    ctx.fillStyle = '#FDA4AF';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillText('NO-GO ZONE', ox + 4, oy + 12);
    ctx.restore();
  });
}

function drawPoisOnCanvas(ctx, w, h) {
  if (!STATE.poiList || STATE.poiList.length === 0) return;

  STATE.poiList.forEach(poi => {
    const px = (poi.x / STATE.fieldWidth) * w;
    const py = (1 - poi.y / STATE.fieldHeight) * h;
    const isTracked = poi.isTracked !== undefined ? poi.isTracked : STATE.nodes.some(n => Math.hypot(n.x - poi.x, n.y - poi.y) <= STATE.sensingRadius);

    const themeColor = isTracked ? '#10B981' : (poi.priority === 3 ? '#F59E0B' : '#38BDF8');

    ctx.save();

    // Concentric reticle rings
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(px, py, 7.5, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair ticks
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px - 11, py);
    ctx.lineTo(px - 4, py);
    ctx.moveTo(px + 4, py);
    ctx.lineTo(px + 11, py);
    ctx.moveTo(px, py - 11);
    ctx.lineTo(px, py - 4);
    ctx.moveTo(px, py + 4);
    ctx.lineTo(px, py + 11);
    ctx.stroke();

    // Center diamond
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.moveTo(px, py - 4);
    ctx.lineTo(px + 4, py);
    ctx.lineTo(px, py + 4);
    ctx.lineTo(px - 4, py);
    ctx.closePath();
    ctx.fill();

    // Label background tag
    const label = `${poi.label} [P${poi.priority}]`;
    ctx.font = 'bold 8.5px JetBrains Mono, monospace';
    const textWidth = ctx.measureText(label).width;

    ctx.fillStyle = 'rgba(7, 9, 14, 0.85)';
    ctx.fillRect(px - textWidth / 2 - 4, py + 9, textWidth + 8, 14);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(px - textWidth / 2 - 4, py + 9, textWidth + 8, 14);

    ctx.fillStyle = isTracked ? '#A7F3D0' : '#FDE68A';
    ctx.textAlign = 'center';
    ctx.fillText(label, px, py + 19.5);

    ctx.restore();
  });
}

function drawJammersOnCanvas(ctx, w, h) {
  if (!STATE.jammers || STATE.jammers.length === 0) return;

  STATE.jammers.forEach(jam => {
    const jx = (jam.x / STATE.fieldWidth) * w;
    const jy = (1 - jam.y / STATE.fieldHeight) * h;
    const jr = (jam.radius / STATE.fieldWidth) * w;

    ctx.save();
    const grad = ctx.createRadialGradient(jx, jy, 2, jx, jy, jr);
    grad.addColorStop(0, 'rgba(225, 29, 72, 0.45)');
    grad.addColorStop(0.7, 'rgba(225, 29, 72, 0.18)');
    grad.addColorStop(1, 'rgba(225, 29, 72, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(jx, jy, jr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(jx, jy, jr, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = `${jam.label.toUpperCase()}`;
    ctx.font = 'bold 8.5px JetBrains Mono, monospace';
    const textW = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(7, 9, 14, 0.85)';
    ctx.fillRect(jx - textW / 2 - 4, jy - 7, textW + 8, 14);
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(jx - textW / 2 - 4, jy - 7, textW + 8, 14);
    ctx.fillStyle = '#FDA4AF';
    ctx.textAlign = 'center';
    ctx.fillText(label, jx, jy + 3.5);

    ctx.restore();
  });
}

function draw2DVoronoi() {
  const canvas = document.getElementById('voronoi-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#07090E';
  ctx.fillRect(0, 0, w, h);

  const activeNodes = STATE.nodes.filter(n => n.energy > 0.001);
  if (activeNodes.length === 0) return;

  const sampleStep = 4;
  const palette = [
    'rgba(56, 189, 248, 0.14)',
    'rgba(99, 102, 241, 0.14)',
    'rgba(168, 85, 247, 0.14)',
    'rgba(16, 185, 129, 0.14)',
    'rgba(245, 158, 11, 0.14)',
    'rgba(244, 63, 94, 0.14)'
  ];

  for (let py = 0; py < h; py += sampleStep) {
    const fy = (1 - py / h) * STATE.fieldHeight;
    for (let px = 0; px < w; px += sampleStep) {
      const fx = (px / w) * STATE.fieldWidth;

      let nearestIdx = 0;
      let minDist = Math.hypot(fx - activeNodes[0].x, fy - activeNodes[0].y);
      for (let i = 1; i < activeNodes.length; i++) {
        const d = Math.hypot(fx - activeNodes[i].x, fy - activeNodes[i].y);
        if (d < minDist) {
          minDist = d;
          nearestIdx = i;
        }
      }

      ctx.fillStyle = palette[nearestIdx % palette.length];
      ctx.fillRect(px, py, sampleStep, sampleStep);
    }
  }

  activeNodes.forEach(node => {
    const nx = (node.x / STATE.fieldWidth) * w;
    const ny = (1 - node.y / STATE.fieldHeight) * h;
    const rPixels = (STATE.sensingRadius / STATE.fieldWidth) * w;
    const isSleep = (node.sleepState === 'sleep');

    ctx.beginPath();
    ctx.arc(nx, ny, rPixels, 0, Math.PI * 2);
    ctx.strokeStyle = isSleep ? 'rgba(129, 140, 248, 0.15)' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = isSleep ? 0.8 : 1;
    if (isSleep) ctx.setLineDash([3, 3]);
    else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(nx, ny, node.isCH ? 4.5 : (isSleep ? 2.5 : 3.0), 0, Math.PI * 2);
    ctx.fillStyle = node.isCH ? '#FBBF24' : (isSleep ? '#64748B' : '#38BDF8');
    ctx.fill();
    ctx.strokeStyle = isSleep ? '#818CF8' : '#07090E';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  drawObstaclesOnCanvas(ctx, w, h);
  drawPoisOnCanvas(ctx, w, h);
  drawJammersOnCanvas(ctx, w, h);
}

// ============================================================================
// 9. ROUTING CHARTS SETUP
// ============================================================================
function initRoutingCharts() {
  const ctxLifetime = document.getElementById('chart-lifetime');
  const ctxEnergy = document.getElementById('chart-energy');
  if (!ctxLifetime || !ctxEnergy) return;

  const rounds = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 535, 600, 700, 800, 900, 1000];

  const leachLifetime = [100, 100, 96, 80, 58, 38, 20, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const pegasisLifetime = [100, 100, 100, 100, 100, 88, 71, 68, 64, 52, 28, 0, 0, 0, 0, 0, 0];
  const hybridLifetime = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99, 90, 78, 64, 52, 40];

  STATE.charts.lifetime = new Chart(ctxLifetime, {
    type: 'line',
    data: {
      labels: rounds,
      datasets: [
        { label: 'Hybrid LEACH-PEGASIS (Proposed)', data: hybridLifetime, borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderWidth: 2.5, tension: 0.25, fill: true },
        { label: 'PEGASIS Protocol', data: pegasisLifetime, borderColor: '#38BDF8', backgroundColor: 'transparent', borderWidth: 1.8, borderDash: [4, 4], tension: 0.25 },
        { label: 'LEACH Protocol', data: leachLifetime, borderColor: '#F43F5E', backgroundColor: 'transparent', borderWidth: 1.8, tension: 0.25 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, title: { display: true, text: 'Simulation Rounds', color: '#64748B' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, title: { display: true, text: 'Active Sensor Nodes (%)', color: '#64748B' }, min: 0, max: 105 }
      },
      plugins: { legend: { labels: { color: '#94A3B8', font: { family: 'Inter', size: 12 } } } }
    }
  });

  const leachEnergy = [0.50, 0.34, 0.23, 0.16, 0.11, 0.07, 0.04, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  const pegasisEnergy = [0.50, 0.42, 0.36, 0.31, 0.26, 0.22, 0.19, 0.16, 0.13, 0.09, 0.04, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  const hybridEnergy = [0.50, 0.45, 0.41, 0.37, 0.34, 0.31, 0.28, 0.25, 0.23, 0.20, 0.19, 0.18, 0.16, 0.13, 0.11, 0.09, 0.07];

  STATE.charts.energy = new Chart(ctxEnergy, {
    type: 'line',
    data: {
      labels: rounds,
      datasets: [
        { label: 'Hybrid LEACH-PEGASIS', data: hybridEnergy, borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderWidth: 2.5, tension: 0.25, fill: true },
        { label: 'PEGASIS Protocol', data: pegasisEnergy, borderColor: '#38BDF8', backgroundColor: 'transparent', borderWidth: 1.8, borderDash: [4, 4], tension: 0.25 },
        { label: 'LEACH Protocol', data: leachEnergy, borderColor: '#F43F5E', backgroundColor: 'transparent', borderWidth: 1.8, tension: 0.25 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, title: { display: true, text: 'Simulation Rounds', color: '#64748B' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, title: { display: true, text: 'Average Residual Energy (Joules)', color: '#64748B' } }
      },
      plugins: { legend: { labels: { color: '#94A3B8', font: { family: 'Inter', size: 12 } } } }
    }
  });

  // 3. Multi-Objective Algorithm Trade-Off Radar Chart
  const ctxRadar = document.getElementById('chart-radar');
  if (ctxRadar) {
    const radarLabels = [
      'Coverage Efficacy',
      'Hole Eradication',
      'Overlap Control',
      'Energy Conservation',
      'Lifetime Longevity'
    ];

    STATE.charts.radar = new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: 'EA-VVF-MOPSO (Proposed)',
            data: RADAR_BENCHMARKS['ea-vvf-mopso'].scores,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.22)',
            pointBackgroundColor: '#10B981',
            borderWidth: 2.5
          },
          {
            label: 'Standard PSO',
            data: RADAR_BENCHMARKS['pso'].scores,
            borderColor: '#38BDF8',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            pointBackgroundColor: '#38BDF8',
            borderWidth: 2,
            borderDash: [4, 4]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: { color: '#94A3B8', font: { family: 'Inter', size: 10 } },
            ticks: { display: false, min: 0, max: 100 }
          }
        },
        plugins: {
          legend: { labels: { color: '#94A3B8', font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }
}

const RADAR_BENCHMARKS = {
  'ea-vvf-mopso': { name: 'EA-VVF-MOPSO (Proposed)', scores: [97.0, 97.0, 76.4, 94.8, 85.0], color: '#10B981' },
  'pso': { name: 'Standard PSO', scores: [100.0, 100.0, 15.1, 33.9, 27.0], color: '#38BDF8' },
  'ga': { name: 'Genetic Algorithm (GA)', scores: [100.0, 100.0, 18.1, 30.6, 42.7], color: '#A855F7' },
  'vfa': { name: 'Virtual Force (VFA)', scores: [100.0, 100.0, 3.3, 48.2, 70.0], color: '#F59E0B' },
  'voronoi': { name: 'Centroidal Voronoi', scores: [46.2, 46.2, 37.8, 46.4, 100.0], color: '#94A3B8' },
  'mopso': { name: 'Standard MOPSO', scores: [93.2, 93.2, 32.5, 55.4, 44.8], color: '#06B6D4' },
  'random': { name: 'Random Placement', scores: [94.6, 94.6, 18.4, 100.0, 31.8], color: '#F43F5E' }
};

function updateRadarComparison(algoKey) {
  if (!STATE.charts.radar || !RADAR_BENCHMARKS[algoKey]) return;
  const benchmark = RADAR_BENCHMARKS[algoKey];

  STATE.charts.radar.data.datasets[1].label = benchmark.name;
  STATE.charts.radar.data.datasets[1].data = benchmark.scores;
  STATE.charts.radar.data.datasets[1].borderColor = benchmark.color;
  STATE.charts.radar.data.datasets[1].pointBackgroundColor = benchmark.color;
  STATE.charts.radar.update();

  const caption = document.getElementById('radar-active-algo-caption');
  if (caption) {
    caption.innerText = `EA-VVF-MOPSO vs. ${benchmark.name}`;
  }
}

// ============================================================================
// 10. MULTI-HOP DATA ROUTING ENGINE
// ============================================================================
let routingSimState = {
  isRunning: false,
  round: 0,
  maxRounds: 1000,
  packetsDelivered: 0,
  intervalId: null,
  protocol: 'hybrid'
};

function drawRoutingBeam(x1, y1, z1, x2, y2, z2, colorHex, opacity = 0.75) {
  if (!routingBeamGroup) return;
  const points = [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: opacity,
    linewidth: 1.5
  });
  const line = new THREE.Line(lineGeo, lineMat);
  routingBeamGroup.add(line);
}

function updateRoutingTelemetryUI(aliveCount, protocol) {
  const avgEnergy = STATE.nodes.reduce((acc, n) => acc + n.energy, 0) / STATE.nodes.length;
  const rRound = document.getElementById('telemetry-round');
  const rAlive = document.getElementById('telemetry-alive');
  const rEnergy = document.getElementById('telemetry-energy');
  const rPackets = document.getElementById('telemetry-packets');

  if (rRound) rRound.innerText = `Round ${routingSimState.round} / ${routingSimState.maxRounds}`;
  if (rAlive) rAlive.innerText = `${aliveCount} / ${STATE.nodes.length} Alive`;
  if (rEnergy) rEnergy.innerText = `${avgEnergy.toFixed(4)} J (${((avgEnergy / 0.50) * 100).toFixed(1)}%)`;
  if (rPackets) rPackets.innerText = `${routingSimState.packetsDelivered} Packets`;

  const badge = document.getElementById('routing-live-status-badge');
  const bRound = document.getElementById('routing-live-round-text');
  const bAlive = document.getElementById('routing-live-alive-text');
  if (badge && bRound && bAlive) {
    badge.style.display = 'block';
    bRound.innerText = `Round ${routingSimState.round} (${protocol.toUpperCase()})`;
    bAlive.innerText = `${aliveCount}/${STATE.nodes.length} Active`;
  }
}

function runSingleRoutingRound(protocol = 'hybrid') {
  const nodes = STATE.nodes;
  const aliveNodes = nodes.filter(n => n.energy > 0.001);

  if (aliveNodes.length === 0 || routingSimState.round >= routingSimState.maxRounds) {
    stopLiveRouting();
    return;
  }

  routingSimState.round++;
  nodes.forEach(n => n.isCH = false);

  if (routingBeamGroup) {
    while (routingBeamGroup.children.length) routingBeamGroup.remove(routingBeamGroup.children[0]);
  }

  // --- DUTY-CYCLE ENGINE: Autonomous Wake-up, Passive Drain & Ambient Harvesting ---
  if (STATE.dutyCycleMode !== 'none') {
    // 1. Dynamic Wake-up: if any active node has critical energy (< 0.08J) or died, awaken nearby dormant sensors
    const criticalNodes = nodes.filter(n => n.sleepState === 'active' && (n.energy < 0.08 || n.energy <= 0.001));
    if (criticalNodes.length > 0) {
      nodes.forEach(sleeping => {
        if (sleeping.sleepState === 'sleep' && sleeping.energy > 0.001) {
          const nearCrit = criticalNodes.some(crit => Math.hypot(sleeping.x - crit.x, sleeping.y - crit.y) <= STATE.sensingRadius * 1.5);
          if (nearCrit) {
            sleeping.sleepState = 'active';
          }
        }
      });
    }

    // 2. Solar Harvesting: dormant sleeping nodes trickle-charge residual battery
    if (STATE.dutyCycleMode === 'harvesting-duty-cycle') {
      let roundHarvested = 0;
      nodes.forEach(n => {
        if (n.sleepState === 'sleep' && n.energy > 0.001) {
          const before = n.energy;
          n.energy = Math.min(0.50, n.energy + 0.00015);
          roundHarvested += (n.energy - before);
        }
      });
      if (!STATE.dutyCycleMetrics) {
        STATE.dutyCycleMetrics = { awakeCount: 0, sleepCount: 0, deadCount: 0, harvestedJoules: 0 };
      }
      STATE.dutyCycleMetrics.harvestedJoules = (STATE.dutyCycleMetrics.harvestedJoules || 0) + roundHarvested;
    }

    // 3. Deep-sleep passive leakage for dormant nodes (0.01 mJ vs active transmit)
    nodes.forEach(n => {
      if (n.sleepState === 'sleep' && n.energy > 0.001) {
        n.energy = Math.max(0, n.energy - 0.00001);
      }
    });
  }

  // Active candidates participating in multi-hop network transmission
  let routingCandidates = aliveNodes.filter(n => n.sleepState !== 'sleep');
  if (routingCandidates.length === 0) {
    aliveNodes.forEach(n => n.sleepState = 'active');
    routingCandidates = aliveNodes;
  }

  const alpha = STATE.pathLossExponent || 2.0;
  const k = 8000;
  const E_elec = 50e-9;
  const eps_fs = 10e-12;
  const eps_mp = 0.0013e-12;
  const d0 = Math.sqrt(eps_fs / eps_mp);
  const sinkX = 50, sinkY = 135;

  function txEnergy(dist) {
    // Physical channel scaling with path loss exponent alpha in [2.0, 4.0]
    return dist < d0
      ? k * (E_elec + eps_fs * Math.pow(dist, alpha))
      : k * (E_elec + eps_mp * Math.pow(dist, alpha + 2));
  }

  if (protocol === 'leach') {
    const numCH = Math.max(1, Math.round(routingCandidates.length * 0.10));
    const chNodes = [...routingCandidates].sort(() => Math.random() - 0.5).slice(0, numCH);
    chNodes.forEach(ch => ch.isCH = true);

    const nonCH = routingCandidates.filter(n => !n.isCH);
    nonCH.forEach(node => {
      let nearestCH = chNodes[0];
      let minDist = Math.hypot(node.x - nearestCH.x, node.y - nearestCH.y);
      for (const ch of chNodes) {
        const d = Math.hypot(node.x - ch.x, node.y - ch.y);
        if (d < minDist) { minDist = d; nearestCH = ch; }
      }

      const jam = checkJammerInterference(node.x, node.y, nearestCH.x, nearestCH.y);
      if (jam && Math.random() < 0.70) {
        STATE.jammerMetrics.droppedPackets++;
        drawRoutingBeam(node.x, node.y, 1.6, nearestCH.x, nearestCH.y, 1.6, 0xE11D48, 0.7);
        node.energy = Math.max(0, node.energy - txEnergy(minDist) * 2.2);
        return;
      }

      drawRoutingBeam(node.x, node.y, 1.6, nearestCH.x, nearestCH.y, 1.6, jam ? 0xFBBF24 : 0xF43F5E, 0.4);
      spawnFlyingPacket(node.x, node.y, 1.6, nearestCH.x, nearestCH.y, 1.6, jam ? 0xFBBF24 : 0xF43F5E);
      node.energy = Math.max(0, node.energy - txEnergy(minDist));
      nearestCH.energy = Math.max(0, nearestCH.energy - (k * E_elec + 5e-9 * k));
    });

    chNodes.forEach(ch => {
      const dToSink = Math.hypot(ch.x - sinkX, ch.y - sinkY);
      const jam = checkJammerInterference(ch.x, ch.y, sinkX, sinkY);
      if (jam && Math.random() < 0.70) {
        STATE.jammerMetrics.droppedPackets++;
        drawRoutingBeam(ch.x, ch.y, 1.6, sinkX, sinkY, 17, 0xE11D48, 0.85);
        ch.energy = Math.max(0, ch.energy - txEnergy(dToSink) * 2.2);
        return;
      }
      drawRoutingBeam(ch.x, ch.y, 1.6, sinkX, sinkY, 17, jam ? 0xFBBF24 : 0xF43F5E, 0.85);
      spawnFlyingPacket(ch.x, ch.y, 1.6, sinkX, sinkY, 17, jam ? 0xFBBF24 : 0xF43F5E);
      ch.energy = Math.max(0, ch.energy - txEnergy(dToSink));
      routingSimState.packetsDelivered++;
    });

  } else if (protocol === 'pegasis') {
    const unvisited = [...routingCandidates];
    const chain = [];
    let curr = unvisited.shift();
    chain.push(curr);

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDist = Math.hypot(curr.x - unvisited[0].x, curr.y - unvisited[0].y);
      for (let i = 1; i < unvisited.length; i++) {
        const d = Math.hypot(curr.x - unvisited[i].x, curr.y - unvisited[i].y);
        if (d < minDist) { minDist = d; nearestIdx = i; }
      }
      curr = unvisited.splice(nearestIdx, 1)[0];
      chain.push(curr);
    }

    for (let i = 0; i < chain.length - 1; i++) {
      const u = chain[i];
      const v = chain[i + 1];
      const d = Math.hypot(u.x - v.x, u.y - v.y);
      const jam = checkJammerInterference(u.x, u.y, v.x, v.y);
      if (jam && Math.random() < 0.70) {
        STATE.jammerMetrics.droppedPackets++;
        drawRoutingBeam(u.x, u.y, 1.6, v.x, v.y, 1.6, 0xE11D48, 0.7);
        u.energy = Math.max(0, u.energy - txEnergy(d) * 2.2);
        continue;
      }
      drawRoutingBeam(u.x, u.y, 1.6, v.x, v.y, 1.6, jam ? 0xFBBF24 : 0x38BDF8, 0.55);
      spawnFlyingPacket(u.x, u.y, 1.6, v.x, v.y, 1.6, jam ? 0xFBBF24 : 0x38BDF8);
      u.energy = Math.max(0, u.energy - txEnergy(d));
      v.energy = Math.max(0, v.energy - (k * E_elec + 5e-9 * k));
    }

    const leader = chain[Math.floor(chain.length / 2)];
    leader.isCH = true;
    const dToSink = Math.hypot(leader.x - sinkX, leader.y - sinkY);
    const jamSink = checkJammerInterference(leader.x, leader.y, sinkX, sinkY);
    if (jamSink && Math.random() < 0.70) {
      STATE.jammerMetrics.droppedPackets++;
      drawRoutingBeam(leader.x, leader.y, 1.6, sinkX, sinkY, 17, 0xE11D48, 0.85);
      leader.energy = Math.max(0, leader.energy - txEnergy(dToSink) * 2.2);
    } else {
      drawRoutingBeam(leader.x, leader.y, 1.6, sinkX, sinkY, 17, jamSink ? 0xFBBF24 : 0x38BDF8, 0.85);
      spawnFlyingPacket(leader.x, leader.y, 1.6, sinkX, sinkY, 17, jamSink ? 0xFBBF24 : 0x38BDF8);
      leader.energy = Math.max(0, leader.energy - txEnergy(dToSink));
      routingSimState.packetsDelivered++;
    }

  } else {
    // HYBRID LEACH-PEGASIS
    const numCH = Math.max(1, Math.round(routingCandidates.length * 0.05));
    const chNodes = [...routingCandidates].sort((a, b) => b.energy - a.energy).slice(0, numCH);
    chNodes.forEach(ch => ch.isCH = true);

    const nonCH = routingCandidates.filter(n => !n.isCH);
    const clusters = chNodes.map(ch => ({ ch: ch, members: [] }));
    nonCH.forEach(node => {
      let bestCluster = 0;
      let minDist = Math.hypot(node.x - chNodes[0].x, node.y - chNodes[0].y);
      for (let c = 1; c < chNodes.length; c++) {
        const d = Math.hypot(node.x - chNodes[c].x, node.y - chNodes[c].y);
        if (d < minDist) { minDist = d; bestCluster = c; }
      }
      clusters[bestCluster].members.push(node);
    });

    clusters.forEach(cl => {
      for (let i = 0; i < cl.members.length; i++) {
        const m = cl.members[i];
        const d = Math.hypot(m.x - cl.ch.x, m.y - cl.ch.y);
        const jam = checkJammerInterference(m.x, m.y, cl.ch.x, cl.ch.y);
        if (jam && Math.random() < 0.70) {
          STATE.jammerMetrics.droppedPackets++;
          drawRoutingBeam(m.x, m.y, 1.6, cl.ch.x, cl.ch.y, 1.6, 0xE11D48, 0.65);
          m.energy = Math.max(0, m.energy - (txEnergy(d) * 1.5));
          continue;
        }
        drawRoutingBeam(m.x, m.y, 1.6, cl.ch.x, cl.ch.y, 1.6, jam ? 0xFBBF24 : 0x10B981, 0.45);
        spawnFlyingPacket(m.x, m.y, 1.6, cl.ch.x, cl.ch.y, 1.6, jam ? 0xFBBF24 : 0x10B981);
        m.energy = Math.max(0, m.energy - (txEnergy(d) * 0.7));
        cl.ch.energy = Math.max(0, cl.ch.energy - (k * E_elec * 0.4));
      }
    });

    chNodes.forEach(ch => {
      const dToSink = Math.hypot(ch.x - sinkX, ch.y - sinkY);
      if (dToSink < 75 || chNodes.length === 1) {
        const jam = checkJammerInterference(ch.x, ch.y, sinkX, sinkY);
        if (jam && Math.random() < 0.70) {
          STATE.jammerMetrics.droppedPackets++;
          drawRoutingBeam(ch.x, ch.y, 1.6, sinkX, sinkY, 17, 0xE11D48, 0.95);
          ch.energy = Math.max(0, ch.energy - txEnergy(dToSink) * 2.2);
        } else {
          drawRoutingBeam(ch.x, ch.y, 1.6, sinkX, sinkY, 17, jam ? 0xFBBF24 : 0x34D399, 0.95);
          spawnFlyingPacket(ch.x, ch.y, 1.6, sinkX, sinkY, 17, jam ? 0xFBBF24 : 0x34D399);
          ch.energy = Math.max(0, ch.energy - txEnergy(dToSink));
          routingSimState.packetsDelivered++;
        }
      } else {
        let forwardCH = chNodes.find(other => other !== ch && Math.hypot(other.x - sinkX, other.y - sinkY) < dToSink) || ch;
        const dHop = Math.hypot(ch.x - forwardCH.x, ch.y - forwardCH.y);
        const jam = checkJammerInterference(ch.x, ch.y, forwardCH.x, forwardCH.y);
        if (jam && Math.random() < 0.70) {
          STATE.jammerMetrics.droppedPackets++;
          drawRoutingBeam(ch.x, ch.y, 1.6, forwardCH.x, forwardCH.y, 1.6, 0xE11D48, 0.75);
          ch.energy = Math.max(0, ch.energy - txEnergy(dHop) * 2.2);
        } else {
          drawRoutingBeam(ch.x, ch.y, 1.6, forwardCH.x, forwardCH.y, 1.6, jam ? 0xFBBF24 : 0x34D399, 0.75);
          spawnFlyingPacket(ch.x, ch.y, 1.6, forwardCH.x, forwardCH.y, 1.6, jam ? 0xFBBF24 : 0x34D399);
          ch.energy = Math.max(0, ch.energy - txEnergy(dHop));
          routingSimState.packetsDelivered++;
        }
      }
    });
  }

  SFX.packetArrive();
  triggerBaseStationPulse();

  if (STATE.dutyCycleMode !== 'none') {
    updateDutyCycleSchedule();
  }

  rebuildSceneMeshes();
  if (routingSimState.round % 2 === 0 || aliveNodes.length === 0) {
    compute2DGridMetrics();
  }
  updateRoutingTelemetryUI(aliveNodes.length, protocol);
}

function startLiveRouting(protocol = 'hybrid') {
  if (routingSimState.isRunning) {
    stopLiveRouting();
    return;
  }
  routingSimState.isRunning = true;
  routingSimState.protocol = protocol;

  const btn3D = document.getElementById('btn-start-routing');
  const btnTab = document.getElementById('btn-run-routing-tab');
  if (btn3D) btn3D.innerText = `Pause Multi-Hop Stream`;
  if (btnTab) btnTab.innerText = `Pause Routing Cycle`;

  routingSimState.intervalId = setInterval(() => {
    runSingleRoutingRound(routingSimState.protocol);
    if (routingSimState.round >= routingSimState.maxRounds || STATE.nodes.every(n => n.energy <= 0.001)) {
      stopLiveRouting();
    }
  }, 100);
}

function stopLiveRouting() {
  routingSimState.isRunning = false;
  if (routingSimState.intervalId) {
    clearInterval(routingSimState.intervalId);
    routingSimState.intervalId = null;
  }
  const btn3D = document.getElementById('btn-start-routing');
  const btnTab = document.getElementById('btn-run-routing-tab');
  if (btn3D) btn3D.innerText = `Resume Multi-Hop Stream`;
  if (btnTab) btnTab.innerText = `Resume Routing Cycle`;
}

function resetLiveRouting() {
  SFX.click();
  stopLiveRouting();
  routingSimState.round = 0;
  routingSimState.packetsDelivered = 0;
  STATE.nodes.forEach(n => {
    n.energy = 0.50;
    n.isCH = false;
  });
  if (STATE.dutyCycleMetrics) {
    STATE.dutyCycleMetrics.harvestedJoules = 0;
  }
  if (STATE.jammerMetrics) {
    STATE.jammerMetrics.droppedPackets = 0;
  }
  updateDutyCycleSchedule();
  if (routingBeamGroup) {
    while (routingBeamGroup.children.length) routingBeamGroup.remove(routingBeamGroup.children[0]);
  }
  if (packetGroup) {
    while (packetGroup.children.length) packetGroup.remove(packetGroup.children[0]);
  }
  activePackets = [];

  rebuildSceneMeshes();
  compute2DGridMetrics();
  updateRoutingTelemetryUI(STATE.nodes.length, routingSimState.protocol);
  const btn3D = document.getElementById('btn-start-routing');
  const btnTab = document.getElementById('btn-run-routing-tab');
  if (btn3D) btn3D.innerText = `Start Multi-Hop Packet Stream`;
  if (btnTab) btnTab.innerText = `Execute Routing Cycle`;
}

// ============================================================================
// 11. CODEBASE MODULES
// ============================================================================
const CODE_FILES = {
  'sensor.py': `class SensorNode:
    """Represents a single physical sensor in the WSN."""
    def __init__(self, node_id: int, x: float, y: float, Rs: float = 15.0, Rc: float = 30.0, E0: float = 0.5):
        self.node_id = node_id
        self.x = float(x)
        self.y = float(y)
        self.initial_x = float(x)
        self.initial_y = float(y)
        self.sensing_radius = float(Rs)
        self.communication_radius = float(Rc)
        self.initial_energy = float(E0)
        self.residual_energy = float(E0)
        self.is_alive = True

    def can_sense(self, tx: float, ty: float) -> bool:
        """Binary disk model: dist <= Rs."""
        return math.hypot(self.x - tx, self.y - ty) <= self.sensing_radius

    def move_by(self, dx: float, dy: float, field_w: float, field_h: float, cost_per_meter: float = 0.005) -> float:
        """Moves sensor and deducts physical displacement energy."""
        if not self.is_alive or self.residual_energy <= 0:
            return 0.0
        new_x = max(0.0, min(field_w, self.x + dx))
        new_y = max(0.0, min(field_h, self.y + dy))
        dist = math.hypot(new_x - self.x, new_y - self.y)
        energy_spent = dist * cost_per_meter
        self.residual_energy = max(0.0, self.residual_energy - energy_spent)
        self.x, self.y = new_x, new_y
        return dist`,

  'coverage_model.py': `class CoverageEvaluator:
    """Fast vectorized 2D grid matrix evaluator via NumPy broadcasting."""
    def __init__(self, field_width: float = 100.0, field_height: float = 100.0, resolution: float = 1.0):
        self.x_coords = np.arange(0, field_width + resolution / 2.0, resolution)
        self.y_coords = np.arange(0, field_height + resolution / 2.0, resolution)
        self.grid_x, self.grid_y = np.meshgrid(self.x_coords, self.y_coords)
        self.grid_points = np.column_stack([self.grid_x.ravel(), self.grid_y.ravel()])
        self.num_grid_points = len(self.grid_points)

    def compute_coverage_matrix(self, coords: np.ndarray, Rs: float = 15.0) -> np.ndarray:
        # Broadcasting: (G, N, 2)
        diff = self.grid_points[:, np.newaxis, :] - coords[np.newaxis, :, :]
        dist_sq = np.sum(diff**2, axis=-1)
        covered_mask = dist_sq <= (Rs**2)
        count_per_point = np.sum(covered_mask, axis=1)
        return count_per_point.reshape(self.grid_x.shape).astype(np.int32)`,

  'voronoi.py': `class VoronoiPartitioner:
    """Computes bounded Voronoi territories and detects coverage holes."""
    def __init__(self, field_width: float = 100.0, field_height: float = 100.0):
        self.field_bounds = box(0, 0, field_width, field_height)

    def partition_field(self, sensor_coords: np.ndarray) -> List[Polygon]:
        points = MultiPoint([Point(x, y) for x, y in sensor_coords])
        cells = voronoi_diagram(points, envelope=self.field_bounds)
        return [cell.intersection(self.field_bounds) for cell in cells.geoms]`,

  'hybrid_leach_pegasis.py': `class HybridLEACHPEGASISSimulator:
    """Dynamic Cluster Head election + Intra-Cluster PEGASIS daisy chains."""
    def run_simulation(self, nodes, max_rounds=1000):
        for r in range(max_rounds):
            # 1. Top 5% residual energy nodes elected and rotated as CHs
            # 2. Non-CH nodes join nearest CH
            # 3. Inside each cluster, form nearest-neighbor PEGASIS chain
            # 4. Sequential data passing with 0.8 aggregation factor
            # 5. Inter-CH multi-hop transmission if dist < 75m, else direct to Base Station`
};

window.viewCodeFile = function (fileName) {
  SFX.click();
  const pre = document.getElementById('code-display');
  const title = document.getElementById('code-filename-title');
  if (!pre || !title) return;

  title.innerText = fileName;
  pre.textContent = CODE_FILES[fileName] || '# File not found';
  if (window.Prism && window.Prism.highlightElement) {
    window.Prism.highlightElement(pre);
  }

  document.querySelectorAll('.file-item').forEach(item => {
    item.classList.toggle('active', item.dataset.file === fileName);
  });
};

// ============================================================================
// 12. 3D CARD TILT & SPOTLIGHT CONTROLLER
// ============================================================================
function init3DMotionEffects() {
  const cards = document.querySelectorAll('.glass-panel, .metric-card, [data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
    });
  });
}

// ============================================================================
// 13. APP INITIALIZATION & LISTENERS
// ============================================================================
function initApp() {
  initAmbientLiquidCanvas();
  generateDeployments();
  initThreeScene();
  compute2DGridMetrics();
  initRoutingCharts();
  init3DMotionEffects();
  window.viewCodeFile('sensor.py');

  // Audio Toggle
  const audioBtn = document.getElementById('btn-audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      STATE.audioEnabled = !STATE.audioEnabled;
      const text = document.getElementById('audio-text');
      if (text) text.innerText = STATE.audioEnabled ? 'Audio Feedback' : 'Muted';
      audioBtn.classList.toggle('muted', !STATE.audioEnabled);
      if (STATE.audioEnabled) SFX.click();
    });
  }

  // Navigation Tabs
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      SFX.click();
      const tabId = btn.dataset.tab;
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(`view-${tabId}`);
      if (targetView) targetView.classList.add('active');
      STATE.activeTab = tabId;

      if (tabId === '2d-grid') {
        compute2DGridMetrics();
      } else if (tabId === 'routing') {
        setTimeout(() => {
          if (STATE.charts.lifetime) STATE.charts.lifetime.resize();
          if (STATE.charts.energy) STATE.charts.energy.resize();
          if (STATE.charts.radar) STATE.charts.radar.resize();
        }, 50);
      }

      // Re-init tilt on active view cards
      setTimeout(init3DMotionEffects, 50);
    });
  });

  // Preset Selector
  const presetSelect = document.getElementById('select-preset');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      SFX.click();
      const p = e.target.value;
      STATE.currentScenario = p;
      if (p === 's1') {
        STATE.numSensors = 30;
        STATE.sensingRadius = 10;
        STATE.commRadius = 22;
      } else if (p === 's2') {
        STATE.numSensors = 50;
        STATE.sensingRadius = 15;
        STATE.commRadius = 30;
      } else if (p === 's3') {
        STATE.numSensors = 80;
        STATE.sensingRadius = 12;
        STATE.commRadius = 25;
      } else if (p === 's4') {
        STATE.numSensors = 100;
        STATE.sensingRadius = 15;
        STATE.commRadius = 30;
      }

      document.getElementById('val-nodes').innerText = STATE.numSensors;
      document.getElementById('slider-nodes').value = STATE.numSensors;
      document.getElementById('val-rs').innerText = `${STATE.sensingRadius}m`;
      document.getElementById('slider-rs').value = STATE.sensingRadius;
      document.getElementById('val-rc').innerText = `${STATE.commRadius}m`;
      document.getElementById('slider-rc').value = STATE.commRadius;

      resetLiveRouting();
      STATE.isOptimized = false;
      generateDeployments();
      rebuildSceneMeshes();
      compute2DGridMetrics();
      if (optBtn) {
        optBtn.innerText = 'Execute Spatial Repositioning';
        optBtn.disabled = false;
      }
    });
  }

  // Obstacle Preset Selector
  const obstacleSelect = document.getElementById('select-obstacle-preset');
  if (obstacleSelect) {
    obstacleSelect.addEventListener('change', (e) => {
      setObstaclePreset(e.target.value);
    });
  }

  // Mission Targets & POI Preset Selector
  const poiSelect = document.getElementById('select-poi-preset');
  if (poiSelect) {
    poiSelect.addEventListener('change', (e) => {
      setPoiPreset(e.target.value);
    });
  }

  // Sensor Sleep/Wake Duty-Cycle Scheduling Selector
  const dutyCycleSelect = document.getElementById('select-duty-cycle');
  if (dutyCycleSelect) {
    dutyCycleSelect.addEventListener('change', (e) => {
      setDutyCycleMode(e.target.value);
    });
  }

  // RF Jamming & Cyber-Interference Preset Selector
  const jammerSelect = document.getElementById('select-jammer-preset');
  if (jammerSelect) {
    jammerSelect.addEventListener('change', (e) => {
      setJammerPreset(e.target.value);
    });
  }

  // Wireless Channel Path Loss Exponent Slider
  const sliderPathLoss = document.getElementById('slider-path-loss');
  if (sliderPathLoss) {
    sliderPathLoss.addEventListener('input', (e) => {
      setPathLossExponent(parseFloat(e.target.value));
    });
  }

  // Regional EMP Blast Shockwave Trigger
  const empBtn = document.getElementById('btn-trigger-emp');
  if (empBtn) {
    empBtn.addEventListener('click', () => {
      triggerRegionalEmpBlast(50, 50, 25);
    });
  }

  // Viewport Spatial Direct Manipulation Toolbar
  ['inspect', 'drag', 'inject', 'delete'].forEach(mode => {
    const btn = document.getElementById(`btn-tool-${mode}`);
    if (btn) {
      btn.addEventListener('click', () => {
        setInteractionMode(mode);
      });
    }
  });

  init2DCanvasInteractions();

  // Optimization Button
  const optBtn = document.getElementById('btn-run-optimization');
  const algoSelect = document.getElementById('select-algorithm');
  if (optBtn) {
    optBtn.addEventListener('click', () => {
      SFX.click();
      const selectedAlgo = algoSelect ? algoSelect.value : 'ea-vvf-mopso';

      // CRITICAL FIX: Always reset nodes to pristine initial deployment coordinates first
      // This ensures 100% deterministic, idempotent, and reproducible output!
      resetLiveRouting();
      STATE.nodes.forEach(node => {
        node.x = node.initialX;
        node.y = node.initialY;
        node.energy = 0.50;
        node.isCH = false;
      });
      STATE.isOptimized = false;
      STATE.activeAlgorithm = selectedAlgo;
      rebuildSceneMeshes();
      compute2DGridMetrics();

      optBtn.innerText = `Optimizing via ${selectedAlgo.toUpperCase()}...`;
      optBtn.disabled = true;

      const scenarioKey = STATE.currentScenario || 's2';
      const benchmarkSet = BENCHMARK_DEPLOYMENTS[scenarioKey];
      const targetCoords = (benchmarkSet && benchmarkSet[selectedAlgo] && benchmarkSet[selectedAlgo].length === STATE.nodes.length)
        ? benchmarkSet[selectedAlgo]
        : null;

      let steps = 0;
      const maxSteps = selectedAlgo === 'ea-vvf-mopso' ? 35 : (selectedAlgo === 'vfa' ? 30 : 25);
      const interval = setInterval(() => {
        if (targetCoords) {
          const t = Math.min(1, (steps + 1) / maxSteps);
          // Cubic ease-out
          const ease = 1 - Math.pow(1 - t, 3);
          for (let i = 0; i < STATE.nodes.length; i++) {
            let tx = targetCoords[i][0];
            let ty = targetCoords[i][1];

            // Adaptive POI target concentration
            if (STATE.poiList && STATE.poiList.length > 0) {
              const poiForce = computePoiAttraction(tx, ty, STATE.sensingRadius * 1.5);
              tx = Math.max(2, Math.min(STATE.fieldWidth - 2, tx + poiForce.fx * 0.45));
              ty = Math.max(2, Math.min(STATE.fieldHeight - 2, ty + poiForce.fy * 0.45));
            }

            // Obstacle barrier repulsion
            if (STATE.obstacles && STATE.obstacles.length > 0) {
              const rep = computeObstacleRepulsion(tx, ty, STATE.sensingRadius * 1.0);
              if (rep.isInside || Math.hypot(rep.fx, rep.fy) > 0.05) {
                tx = Math.max(2, Math.min(STATE.fieldWidth - 2, tx + rep.fx * 2.0));
                ty = Math.max(2, Math.min(STATE.fieldHeight - 2, ty + rep.fy * 2.0));
              }
            }

            // Decaying micro-jitter during optimization for natural particle convergence
            const jitterMag = (1 - t) * 0.35;
            const jx = Math.sin(steps * 1.5 + i * 2) * jitterMag;
            const jy = Math.cos(steps * 1.5 + i * 2) * jitterMag;
            STATE.nodes[i].x = Math.max(2, Math.min(STATE.fieldWidth - 2, STATE.nodes[i].initialX + ease * (tx - STATE.nodes[i].initialX) + jx));
            STATE.nodes[i].y = Math.max(2, Math.min(STATE.fieldHeight - 2, STATE.nodes[i].initialY + ease * (ty - STATE.nodes[i].initialY) + jy));
          }
        } else {
          runRealTimeOptimizationStep(selectedAlgo, steps, maxSteps);
        }

        rebuildSceneMeshes();
        compute2DGridMetrics();
        SFX.optimizePulse();
        steps++;

        if (steps >= maxSteps) {
          clearInterval(interval);
          if (targetCoords) {
            for (let i = 0; i < STATE.nodes.length; i++) {
              let fx = targetCoords[i][0];
              let fy = targetCoords[i][1];

              if (STATE.poiList && STATE.poiList.length > 0) {
                const poiForce = computePoiAttraction(fx, fy, STATE.sensingRadius * 1.5);
                fx = Math.max(2, Math.min(STATE.fieldWidth - 2, fx + poiForce.fx * 0.45));
                fy = Math.max(2, Math.min(STATE.fieldHeight - 2, fy + poiForce.fy * 0.45));
              }

              if (STATE.obstacles && STATE.obstacles.length > 0) {
                const rep = computeObstacleRepulsion(fx, fy, STATE.sensingRadius * 1.0);
                if (rep.isInside || Math.hypot(rep.fx, rep.fy) > 0.05) {
                  fx = Math.max(2, Math.min(STATE.fieldWidth - 2, fx + rep.fx * 2.0));
                  fy = Math.max(2, Math.min(STATE.fieldHeight - 2, fy + rep.fy * 2.0));
                }
              }
              STATE.nodes[i].x = fx;
              STATE.nodes[i].y = fy;
            }
          }
          STATE.isOptimized = true;
          STATE.activeAlgorithm = selectedAlgo;
          rebuildSceneMeshes();
          compute2DGridMetrics();

          // Dynamic FND update
          if (BENCHMARK_FND[scenarioKey] && BENCHMARK_FND[scenarioKey][selectedAlgo]) {
            const fndInfo = BENCHMARK_FND[scenarioKey][selectedAlgo];
            const elFnd = document.getElementById('hud-fnd');
            const elFndDelta = document.getElementById('hud-fnd-delta');
            if (elFnd) elFnd.innerText = `Round ${fndInfo.fnd}`;
            if (elFndDelta) elFndDelta.innerText = `HND (50% Alive): Round ${fndInfo.hnd}`;
          }

          optBtn.innerText = `Re-run ${selectedAlgo.toUpperCase()} Optimization`;
          optBtn.disabled = false;
        }
      }, 35);
    });
  }

  // Algorithm Dropdown change
  if (algoSelect) {
    algoSelect.addEventListener('change', () => {
      SFX.click();
      resetLiveRouting();
      STATE.nodes.forEach(node => {
        node.x = node.initialX;
        node.y = node.initialY;
        node.energy = 0.50;
        node.isCH = false;
      });
      STATE.isOptimized = false;
      STATE.activeAlgorithm = algoSelect.value;
      rebuildSceneMeshes();
      compute2DGridMetrics();

      const elFnd = document.getElementById('hud-fnd');
      const elFndDelta = document.getElementById('hud-fnd-delta');
      if (elFnd) elFnd.innerText = `Round 204`;
      if (elFndDelta) elFndDelta.innerText = `Baseline (Unoptimized)`;

      if (optBtn) {
        optBtn.innerText = 'Execute Spatial Repositioning';
        optBtn.disabled = false;
      }
    });
  }

  // Reset Button
  const resetBtn = document.getElementById('btn-reset-deployment');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      SFX.click();
      resetLiveRouting();
      STATE.activeAlgorithm = 'random';
      STATE.isOptimized = false;
      generateDeployments();
      rebuildSceneMeshes();
      compute2DGridMetrics();

      const elFnd = document.getElementById('hud-fnd');
      const elFndDelta = document.getElementById('hud-fnd-delta');
      if (elFnd) elFnd.innerText = `Round 204`;
      if (elFndDelta) elFndDelta.innerText = `Unoptimized Baseline FND`;

      if (optBtn) {
        optBtn.innerText = 'Execute Spatial Repositioning';
        optBtn.disabled = false;
      }
    });
  }

  // Live Data Routing in 3D Sidebar
  const btnStartRouting = document.getElementById('btn-start-routing');
  const selectRoutingProto = document.getElementById('select-routing-proto');
  if (btnStartRouting) {
    btnStartRouting.addEventListener('click', () => {
      SFX.click();
      const proto = selectRoutingProto ? selectRoutingProto.value : 'hybrid';
      if (routingSimState.isRunning) {
        stopLiveRouting();
      } else {
        startLiveRouting(proto);
      }
    });
  }

  // Live Data Routing in Benchmark Tab
  const btnRunRoutingTab = document.getElementById('btn-run-routing-tab');
  const selectRoutingTabProto = document.getElementById('select-routing-tab-proto');
  const btnResetRoutingTab = document.getElementById('btn-reset-routing-tab');

  if (btnRunRoutingTab) {
    btnRunRoutingTab.addEventListener('click', () => {
      SFX.click();
      const proto = selectRoutingTabProto ? selectRoutingTabProto.value : 'hybrid';
      if (routingSimState.isRunning) {
        stopLiveRouting();
      } else {
        startLiveRouting(proto);
      }
    });
  }

  if (btnResetRoutingTab) {
    btnResetRoutingTab.addEventListener('click', () => {
      resetLiveRouting();
    });
  }

  // Sliders
  const sliderN = document.getElementById('slider-nodes');
  if (sliderN) {
    sliderN.addEventListener('input', (e) => {
      STATE.numSensors = parseInt(e.target.value);
      document.getElementById('val-nodes').innerText = STATE.numSensors;
      STATE.isOptimized = false;
      resetLiveRouting();
      generateDeployments();
      rebuildSceneMeshes();
      compute2DGridMetrics();
    });
  }

  const sliderRs = document.getElementById('slider-rs');
  if (sliderRs) {
    sliderRs.addEventListener('input', (e) => {
      STATE.sensingRadius = parseFloat(e.target.value);
      document.getElementById('val-rs').innerText = `${STATE.sensingRadius}m`;
      rebuildSceneMeshes();
      compute2DGridMetrics();
    });
  }

  const sliderRc = document.getElementById('slider-rc');
  if (sliderRc) {
    sliderRc.addEventListener('input', (e) => {
      STATE.commRadius = parseFloat(e.target.value);
      document.getElementById('val-rc').innerText = `${STATE.commRadius}m`;
      rebuildSceneMeshes();
    });
  }

  // 1. Export Menu Controls
  const btnExportMenu = document.getElementById('btn-export-menu');
  const exportDropdown = document.getElementById('export-dropdown-menu');
  if (btnExportMenu && exportDropdown) {
    btnExportMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      SFX.click();
      exportDropdown.classList.toggle('show');
      btnExportMenu.classList.toggle('active', exportDropdown.classList.contains('show'));
    });

    document.addEventListener('click', (e) => {
      if (!btnExportMenu.contains(e.target) && !exportDropdown.contains(e.target)) {
        exportDropdown.classList.remove('show');
        btnExportMenu.classList.remove('active');
      }
    });
  }

  const btnExportCsv = document.getElementById('btn-export-csv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      if (exportDropdown) exportDropdown.classList.remove('show');
      exportTopologyCSV();
    });
  }

  const btnExportJson = document.getElementById('btn-export-json');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      if (exportDropdown) exportDropdown.classList.remove('show');
      exportMetricsJSON();
    });
  }

  const btnExportSnapshot = document.getElementById('btn-export-snapshot');
  if (btnExportSnapshot) {
    btnExportSnapshot.addEventListener('click', () => {
      if (exportDropdown) exportDropdown.classList.remove('show');
      exportPublicationSnapshot();
    });
  }

  // 2. Clickable Algorithm Benchmark Table Rows
  document.querySelectorAll('.clickable-algo-row').forEach(row => {
    row.addEventListener('click', () => {
      SFX.click();
      document.querySelectorAll('.clickable-algo-row').forEach(r => r.classList.remove('active-row'));
      row.classList.add('active-row');
      const algoKey = row.dataset.algo;
      if (algoKey) {
        updateRadarComparison(algoKey);
      }
    });
  });

  // Initialize Interactive Hover Control Explainer
  initControlExplainer();
}

// ============================================================================
// PUBLICATION EXPORT SUITE (CSV, JSON, HIGH-RES PNG)
// ============================================================================
function showToast(message) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function exportTopologyCSV() {
  SFX.click();
  const scenario = STATE.currentScenario || 's2';
  const algo = STATE.activeAlgorithm || 'initial';
  const sinkX = 50, sinkY = 150;

  let csv = 'Node_ID,X_meters,Y_meters,Initial_X,Initial_Y,Displacement_m,Sensing_Radius_m,Comm_Radius_m,Residual_Energy_J,Battery_Percent,Duty_Cycle_State,Is_Cluster_Head,Distance_To_Sink_m\n';

  STATE.nodes.forEach(n => {
    const disp = Math.hypot(n.x - n.initialX, n.y - n.initialY).toFixed(3);
    const dToSink = Math.hypot(n.x - sinkX, n.y - sinkY).toFixed(3);
    const battPct = ((n.energy / 0.50) * 100).toFixed(1);
    csv += `${n.id},${n.x.toFixed(4)},${n.y.toFixed(4)},${n.initialX.toFixed(4)},${n.initialY.toFixed(4)},${disp},${STATE.sensingRadius},${STATE.commRadius},${n.energy.toFixed(5)},${battPct},${n.sleepState || 'active'},${n.isCH ? 1 : 0},${dToSink}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wsn_topology_${scenario}_${algo}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`✅ Exported ${STATE.nodes.length} Nodes Topology to CSV`);
}

function exportMetricsJSON() {
  SFX.click();
  const scenario = STATE.currentScenario || 's2';
  const algo = STATE.activeAlgorithm || 'initial';

  const report = {
    metadata: {
      generator: 'WSN Topology & Hybrid Multi-Hop Routing Laboratory',
      algorithm: algo.toUpperCase(),
      scenario: scenario.toUpperCase(),
      timestamp: new Date().toISOString(),
      field_dimensions: { width_m: STATE.fieldWidth, height_m: STATE.fieldHeight, total_area_m2: 10000 },
      base_station: { x: 50, y: 150, z: 20 },
      parameters: {
        nodes_total: STATE.nodes.length,
        nodes_alive: STATE.nodes.filter(n => n.energy > 0.001).length,
        sensing_radius_m: STATE.sensingRadius,
        comm_radius_m: STATE.commRadius,
        initial_energy_joules: 0.50
      }
    },
    performance_metrics: {
      coverage_ratio_cr: parseFloat(STATE.metrics.coverage.toFixed(3)),
      overlap_redundancy_or: parseFloat(STATE.metrics.overlap.toFixed(3)),
      hole_blindspot_ratio_hr: parseFloat(STATE.metrics.holes.toFixed(3)),
      mean_multiplicity_k: parseFloat(STATE.metrics.multiplicity.toFixed(3)),
      downstream_fnd_round: (BENCHMARK_FND[scenario] && BENCHMARK_FND[scenario][algo]) ? BENCHMARK_FND[scenario][algo].fnd : 275,
      downstream_hnd_round: (BENCHMARK_FND[scenario] && BENCHMARK_FND[scenario][algo]) ? BENCHMARK_FND[scenario][algo].hnd : 674
    },
    duty_cycle_scheduling: {
      mode: STATE.dutyCycleMode,
      awake_nodes_count: STATE.dutyCycleMetrics ? STATE.dutyCycleMetrics.awakeCount : STATE.nodes.filter(n => n.sleepState !== 'sleep' && n.energy > 0.001).length,
      sleeping_nodes_count: STATE.dutyCycleMetrics ? STATE.dutyCycleMetrics.sleepCount : 0,
      dead_nodes_count: STATE.dutyCycleMetrics ? STATE.dutyCycleMetrics.deadCount : STATE.nodes.filter(n => n.energy <= 0.001).length,
      ambient_energy_harvested_joules: parseFloat(((STATE.dutyCycleMetrics && STATE.dutyCycleMetrics.harvestedJoules) || 0).toFixed(5))
    },
    channel_and_fault_impairments: {
      path_loss_exponent_alpha: STATE.pathLossExponent || 2.0,
      active_jammer_preset: STATE.activeJammerPreset,
      jammers_active_count: STATE.jammers.length,
      packets_dropped_by_jamming: STATE.jammerMetrics.droppedPackets,
      jammers: STATE.jammers.map(j => ({ id: j.id, x: j.x, y: j.y, radius: j.radius, power: j.power }))
    },
    target_tracking: {
      active_preset: STATE.activePoiPreset,
      targets_total: STATE.poiList.length,
      targets_tracked: STATE.poiMetrics.trackedCount,
      tracking_ratio_pct: STATE.poiMetrics.trackingRatio,
      avg_sensors_per_target: STATE.poiMetrics.avgSensorsPerTarget,
      targets: STATE.poiList.map(p => ({
        id: p.id,
        label: p.label,
        type: p.type,
        coordinates: { x: parseFloat(p.x.toFixed(3)), y: parseFloat(p.y.toFixed(3)) },
        priority: p.priority,
        is_tracked: p.isTracked || false,
        covering_sensors_count: p.coveringSensors || 0
      }))
    },
    sensor_nodes: STATE.nodes.map(n => ({
      id: n.id,
      coordinates: { x: parseFloat(n.x.toFixed(3)), y: parseFloat(n.y.toFixed(3)) },
      initial_coordinates: { x: parseFloat(n.initialX.toFixed(3)), y: parseFloat(n.initialY.toFixed(3)) },
      residual_energy_joules: parseFloat(n.energy.toFixed(5)),
      sleep_state: n.sleepState || 'active',
      is_cluster_head: n.isCH || false
    }))
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wsn_metrics_report_${scenario}_${algo}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`✅ Exported Full Research Telemetry Report to JSON`);
}

function exportPublicationSnapshot() {
  SFX.click();
  if (!renderer || !scene || !camera) return;

  // Force render to ensure drawing buffer is populated
  renderer.render(scene, camera);
  const imgDataUrl = renderer.domElement.toDataURL('image/png');

  const a = document.createElement('a');
  a.href = imgDataUrl;
  const scenario = STATE.currentScenario || 's2';
  const algo = STATE.activeAlgorithm || 'initial';
  a.download = `wsn_publication_figure_${scenario}_${algo}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast(`✅ Generated High-Resolution Publication Figure (.PNG)`);
}

function setObstaclePreset(presetKey) {
  STATE.activeObstaclePreset = presetKey;
  STATE.obstacles = OBSTACLE_PRESETS[presetKey] || [];

  // Eject any sensor nodes currently caught inside obstacles
  if (STATE.obstacles.length > 0) {
    let ejectedCount = 0;
    STATE.nodes.forEach(node => {
      const rep = computeObstacleRepulsion(node.x, node.y, 6.0);
      if (rep.isInside) {
        node.x = Math.max(3, Math.min(STATE.fieldWidth - 3, node.x + rep.fx * 2.2));
        node.y = Math.max(3, Math.min(STATE.fieldHeight - 3, node.y + rep.fy * 2.2));
        node.initialX = node.x;
        node.initialY = node.y;
        ejectedCount++;
      }
    });
    if (ejectedCount > 0) {
      showToast(`⚠️ Repelled ${ejectedCount} sensors outside of ${STATE.obstacles[0].label}`);
    }
  }

  rebuildSceneMeshes();
  compute2DGridMetrics();
  SFX.click();
}

function setPoiPreset(presetKey) {
  STATE.activePoiPreset = presetKey;
  const raw = POI_PRESETS[presetKey] || [];
  STATE.poiList = raw.map(p => ({
    ...p,
    waypoints: p.waypoints ? p.waypoints.map(wp => ({ ...wp })) : null,
    waypointIndex: 0
  }));

  updatePoiTrackingMetrics();
  rebuildSceneMeshes();
  compute2DGridMetrics();
  SFX.click();

  if (STATE.poiList.length > 0) {
    showToast(`🎯 Loaded ${STATE.poiList.length} Mission Targets (${presetKey})`);
  } else {
    showToast(`🎯 Cleared Mission Targets (Uniform Field Coverage)`);
  }
}

function setDutyCycleMode(mode) {
  STATE.dutyCycleMode = mode;
  updateDutyCycleSchedule();
  rebuildSceneMeshes();
  compute2DGridMetrics();
  SFX.click();

  const modeLabels = {
    'none': '100% Active Duty-Cycle (Baseline)',
    'adaptive-redundancy': 'Adaptive Redundancy Duty-Cycle (Sleep ~35% Nodes)',
    'harvesting-duty-cycle': 'Solar Ambient Energy Harvesting (+0.15 mJ/round)'
  };
  showToast(`⚡ Duty-Cycle: ${modeLabels[mode] || mode}`);
}

function setJammerPreset(presetKey) {
  STATE.activeJammerPreset = presetKey;
  const raw = JAMMER_PRESETS[presetKey] || [];
  STATE.jammers = raw.map(j => ({ ...j }));

  const badge = document.getElementById('jammer-badge');
  if (badge) {
    if (STATE.jammers.length > 0) {
      badge.textContent = `⚡ ${STATE.jammers.length} Active`;
      badge.className = 'badge-mini badge-rose';
    } else {
      badge.textContent = 'Off';
      badge.className = 'badge-mini badge-cyan';
    }
  }

  rebuildSceneMeshes();
  compute2DGridMetrics();
  SFX.click();

  if (STATE.jammers.length > 0) {
    SFX.jammerJam();
    showToast(`🚨 Active RF Jammer Deployed (${presetKey})! Radio links in zone will experience high packet dropouts.`);
  } else {
    showToast(`🛡️ RF Jamming Deactivated. Electromagnetic spectrum restored.`);
  }
}

function setPathLossExponent(alpha) {
  STATE.pathLossExponent = parseFloat(alpha);
  const valEl = document.getElementById('val-path-loss');
  if (valEl) {
    let desc = 'Free Space';
    if (alpha >= 3.5) desc = 'Dense Foliage / Urban Multipath';
    else if (alpha >= 2.8) desc = 'Obstructed In-Building';
    else if (alpha > 2.0) desc = 'Suburban Line-of-Sight';
    valEl.textContent = `${alpha.toFixed(1)} (${desc})`;
  }
  SFX.click();
}

function triggerRegionalEmpBlast(epicenterX = 50, epicenterY = 50, radius = 25) {
  SFX.empBlast();
  let casualties = 0;
  STATE.nodes.forEach(node => {
    const d = Math.hypot(node.x - epicenterX, node.y - epicenterY);
    if (d <= radius && node.energy > 0.001) {
      node.energy = 0.0005;
      node.isCH = false;
      node.sleepState = 'dead';
      casualties++;
    }
  });

  createEmpShockwave(epicenterX, epicenterY, radius);

  if (STATE.dutyCycleMode !== 'none') {
    updateDutyCycleSchedule();
  }

  rebuildSceneMeshes();
  compute2DGridMetrics();
  showToast(`💥 Regional EMP Blast: Neutralized ${casualties} Sensors in R=${radius}m Perimeter!`);
}

function injectCustomSensor(x, y) {
  const newId = STATE.nodes.length;
  const newNode = {
    id: newId,
    x: parseFloat(x.toFixed(2)),
    y: parseFloat(y.toFixed(2)),
    initialX: parseFloat(x.toFixed(2)),
    initialY: parseFloat(y.toFixed(2)),
    energy: 0.50,
    isCH: false,
    clusterId: -1,
    isLocked: false
  };

  STATE.nodes.push(newNode);
  STATE.numSensors = STATE.nodes.length;

  const sliderN = document.getElementById('slider-nodes');
  const valN = document.getElementById('val-nodes');
  if (sliderN) sliderN.value = STATE.numSensors;
  if (valN) valN.innerText = `${STATE.numSensors} Nodes`;

  rebuildSceneMeshes();
  compute2DGridMetrics();
  SFX.nodeInject();
  showToast(`➕ Deployed Custom Sensor #${newId} at (${newNode.x}m, ${newNode.y}m)`);
}

function decommissionSensor(nodeId) {
  const idx = STATE.nodes.findIndex(n => n.id === nodeId);
  if (idx === -1) return;

  const removed = STATE.nodes.splice(idx, 1)[0];
  // Re-index remaining nodes
  STATE.nodes.forEach((n, i) => { n.id = i; });
  STATE.numSensors = STATE.nodes.length;

  const sliderN = document.getElementById('slider-nodes');
  const valN = document.getElementById('val-nodes');
  if (sliderN) sliderN.value = STATE.numSensors;
  if (valN) valN.innerText = `${STATE.numSensors} Nodes`;

  rebuildSceneMeshes();
  compute2DGridMetrics();
  SFX.nodeDelete();
  showToast(`🗑️ Decommissioned Sensor Node #${removed.id}`);
}

function setInteractionMode(mode) {
  STATE.interactionMode = mode;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));

  const activeBtn = document.getElementById(`btn-tool-${mode}`);
  if (activeBtn) activeBtn.classList.add('active');

  const container = document.getElementById('threejs-canvas-container');
  const dragBadge = document.getElementById('drag-coord-badge');

  if (container) {
    if (mode === 'inspect') container.style.cursor = 'default';
    else if (mode === 'drag') container.style.cursor = 'grab';
    else if (mode === 'inject') container.style.cursor = 'crosshair';
    else if (mode === 'delete') container.style.cursor = 'pointer';
  }

  if (dragBadge && mode === 'inspect') {
    dragBadge.style.display = 'none';
  }

  const modeLabels = {
    inspect: 'Inspect & Camera Orbit',
    drag: 'Drag & Relocate Sensor',
    inject: 'Click Ground to Inject Sensor',
    delete: 'Click Sensor to Decommission'
  };
  showToast(`🛠️ Tool Active: ${modeLabels[mode] || mode}`);
  SFX.click();
}

function init2DCanvasInteractions() {
  ['heatmap-canvas', 'voronoi-canvas'].forEach(id => {
    const cvs = document.getElementById(id);
    if (!cvs) return;

    let is2dDragging = false;
    let dragged2dNode = null;

    function getCanvasFieldCoords(e) {
      const rect = cvs.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const fx = Math.max(2, Math.min(STATE.fieldWidth - 2, (px / rect.width) * STATE.fieldWidth));
      const fy = Math.max(2, Math.min(STATE.fieldHeight - 2, (1 - py / rect.height) * STATE.fieldHeight));
      return { x: fx, y: fy };
    }

    cvs.addEventListener('mousedown', (e) => {
      const coords = getCanvasFieldCoords(e);
      if (!coords) return;

      if (STATE.interactionMode === 'drag') {
        let closest = null;
        let minDist = 5.5;
        STATE.nodes.forEach(n => {
          const d = Math.hypot(n.x - coords.x, n.y - coords.y);
          if (d < minDist) { minDist = d; closest = n; }
        });
        if (closest) {
          is2dDragging = true;
          dragged2dNode = closest;
          cvs.style.cursor = 'grabbing';
          SFX.click();
        }
      } else if (STATE.interactionMode === 'inject') {
        const rep = computeObstacleRepulsion(coords.x, coords.y, 1.0);
        if (rep.isInside) {
          showToast('⚠️ Cannot deploy sensor inside a restricted hazard zone!');
          return;
        }
        injectCustomSensor(coords.x, coords.y);
      } else if (STATE.interactionMode === 'delete') {
        let closest = null;
        let minDist = 4.5;
        STATE.nodes.forEach(n => {
          const d = Math.hypot(n.x - coords.x, n.y - coords.y);
          if (d < minDist) { minDist = d; closest = n; }
        });
        if (closest) decommissionSensor(closest.id);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (is2dDragging && dragged2dNode) {
        const coords = getCanvasFieldCoords(e);
        if (coords) {
          dragged2dNode.x = coords.x;
          dragged2dNode.y = coords.y;
          dragged2dNode.initialX = coords.x;
          dragged2dNode.initialY = coords.y;
          compute2DGridMetrics();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (is2dDragging && dragged2dNode) {
        showToast(`✅ Node #${dragged2dNode.id} relocated to (${dragged2dNode.x.toFixed(1)}m, ${dragged2dNode.y.toFixed(1)}m)`);
        is2dDragging = false;
        dragged2dNode = null;
        cvs.style.cursor = STATE.interactionMode === 'drag' ? 'grab' : (STATE.interactionMode === 'inject' ? 'crosshair' : 'default');
      }
    });
  });
}

// ============================================================================
// INTERACTIVE BUTTON & SCIENTIFIC TERM EXPLAINER SYSTEM
// ============================================================================
const EXPLAINER_DATA = {
  'btn-run-opt': {
    badge: 'Spatial Optimization',
    badgeClass: '',
    title: 'Execute Spatial Repositioning',
    term: 'Virtual Force-Directed Pareto Swarm (EA-VVF-MOPSO)',
    desc: 'Runs multi-objective evolutionary particle dynamics to migrate sensor nodes away from dense clusters and into unmonitored blindspots while minimizing kinetic movement energy.',
    formula: 'min f₁ = (1 - CR), min f₂ = σ_E, min f₃ = OR'
  },
  'btn-reset-deployment': {
    badge: 'Monte Carlo Reset',
    badgeClass: 'badge-amber',
    title: 'Reset to Initial Distribution',
    term: 'Uniform Pseudo-Random Poisson Initialization',
    desc: 'Reverts all sensor nodes back to their baseline unoptimized spatial coordinates and restores initial electrochemical energy reserves to 0.50 Joules.',
    formula: '(xᵢ, yᵢ) ~ U(0, L)², E₀ = 0.50 J'
  },
  'btn-start-routing': {
    badge: 'Packet Dissemination',
    badgeClass: 'badge-emerald',
    title: 'Start Multi-Hop Packet Stream',
    term: 'Clustered Radio Energy Transmission',
    desc: 'Starts real-time telemetry streaming from member nodes to elected Cluster Heads (CH) and onwards to the Base Station at (50, 150), depleting node battery according to distance.',
    formula: 'E_tx(k, d) = k·E_elec + (d < d₀ ? k·ε_fs·d² : k·ε_mp·d⁴)'
  },
  'btn-run-routing-tab': {
    badge: 'Protocol Telemetry',
    badgeClass: 'badge-emerald',
    title: 'Execute Routing Cycle',
    term: 'Multi-Round Protocol Lifetime Benchmarking',
    desc: 'Steps through 1000 communication rounds to track residual energy dissipation, Cluster Head rotation efficiency, and First Node Dead (FND) longevity.',
    formula: 'Lifetime Metric: FND, HND (50% Dead), LND (Last Dead)'
  },
  'btn-reset-routing-tab': {
    badge: 'Energy Recovery',
    badgeClass: 'badge-amber',
    title: 'Reset Energy States',
    term: 'Electrochemical Energy Re-initialization',
    desc: 'Restores 100% full initial battery charge (0.500 J) across all sensor nodes and clears simulated packet transmission buffers.',
    formula: 'E_residual(i) = 0.500 J, Round = 0'
  },
  'preset-select': {
    badge: 'Topology Scale',
    badgeClass: 'badge-purple',
    title: 'Benchmark Deployment Scenario',
    term: 'Standardized Empirical Scale Preset (S1 - S4)',
    desc: 'Selects peer-reviewed benchmark network configurations ranging from sparse grids (N=30, Rs=10m) to extended array scales (N=100, Rs=15m).',
    formula: 'Field Dimension: 100m × 100m (10,000 m²)'
  },
  'algo-select': {
    badge: 'Optimization Engine',
    badgeClass: '',
    title: 'Optimization Algorithm',
    term: 'Computational Geometry & Swarm Metaheuristics',
    desc: 'Switches the spatial solver between EA-VVF-MOPSO (energy-aware proposed), Virtual Force Algorithm (VFA), PSO, GA, Centroidal Voronoi, and Standard MOPSO.',
    formula: 'v_i(t+1) = w·v_i + c₁r₁(pbest - x) + c₂r₂(gbest - x)'
  },
  'routing-proto-select': {
    badge: 'MAC / Network Layer',
    badgeClass: 'badge-emerald',
    title: 'Routing Protocol Selection',
    term: 'Hierarchical Clustering & Chain Multi-Hop Topology',
    desc: 'Selects the transmission strategy: Hybrid LEACH-PEGASIS (longest lifetime), PEGASIS (greedy daisy-chain hop), or classic LEACH (direct cluster relay).',
    formula: 'T(n) = P / (1 - P·(r mod 1/P)) if n ∈ G'
  },
  'slider-nodes': {
    badge: 'Network Density',
    badgeClass: 'badge-purple',
    title: 'Sensor Nodes Count (N)',
    term: 'Spatial Point Cardinality & Node Density',
    desc: 'Sets the total number of sensing nodes deployed in the 100m × 100m field. Higher node counts improve coverage but raise medium contention.',
    formula: 'Density ρ = N / (100 × 100) nodes/m²'
  },
  'slider-rs': {
    badge: 'Sensor Physics',
    badgeClass: '',
    title: 'Sensing Radius (Rs)',
    term: 'Boolean Disk Sensing Horizon (Rs)',
    desc: 'Radial distance within which a sensor detects physical events with 100% confidence. Sensing disk coverage area equals π·Rs².',
    formula: 'P(s, p) = 1 if ||p - s|| ≤ Rs else 0'
  },
  'slider-rc': {
    badge: 'RF Transceiver',
    badgeClass: '',
    title: 'Communication Radius (Rc)',
    term: 'Wireless Link Reach & Network Connectivity',
    desc: 'Maximum RF transmission range for single-hop packet exchange. When Rc ≥ 2·Rs, a fully covered network is guaranteed to remain connected.',
    formula: 'Rc ≥ 2·Rs ⟹ 1-Coverage implies 1-Connectivity'
  },
  'cam-iso': {
    badge: 'Camera View',
    badgeClass: 'badge-purple',
    title: 'Perspective View',
    term: '3D Isometric Orbit Projection',
    desc: 'Elevates the virtual 3D camera to an oblique 45° angle to visualize sensor heights, sensing bubbles, and packet elevations.',
    formula: 'P_cam = (50, -55, 120), LookAt = (50, 50, 0)'
  },
  'cam-top': {
    badge: 'Camera View',
    badgeClass: 'badge-purple',
    title: 'Top-Down View',
    term: 'Planar Orthographic Viewport',
    desc: 'Aligns the camera directly perpendicular over the 100m × 100m grid for planimetric inspection of coverage overlap and Voronoi boundaries.',
    formula: 'P_cam = (50, 50, 150), LookAt = (50, 50, 0)'
  },
  'cam-sink': {
    badge: 'Camera View',
    badgeClass: 'badge-purple',
    title: 'Sink View',
    term: 'Base Station Observer Perspective',
    desc: 'Places the camera at the remote Base Station position (50, 150) looking inward toward incoming packet relay routes.',
    formula: 'Base Station Coord: (50, 150, 20)'
  },
  'toggle-orbit': {
    badge: 'Motion Control',
    badgeClass: '',
    title: '360° Motion Turntable',
    term: 'Azimuthal Orbit Kinematics',
    desc: 'Toggles automated continuous rotation of the 3D field around its central axis (50, 50) for dynamic spatial inspection.',
    formula: 'θ(t) = θ₀ + ω·t (ω = 0.005 rad/frame)'
  },
  'toggle-bubbles': {
    badge: 'Spatial Render',
    badgeClass: '',
    title: 'Sensing Disk Bubbles',
    term: 'Volumetric Detection Spheres',
    desc: 'Toggles 3D translucent hemispherical bubble meshes around each sensor to visualize detection volume intersections.',
    formula: 'Sphere(xᵢ, yᵢ, Rs), Opacity = 0.18'
  },
  'btn-audio': {
    badge: 'Audio Synthesis',
    badgeClass: 'badge-amber',
    title: 'Synthesized Audio Feedback',
    term: 'Web Audio API Real-Time Sonification',
    desc: 'Toggles acoustic synthesizer tones generated during particle optimization, packet routing hops, and UI clicks.',
    formula: 'Sine / Triangle Waveform Carrier, Exponential Decay'
  },
  'btn-pdf': {
    badge: 'Technical Research',
    badgeClass: 'badge-emerald',
    title: 'Technical Guide PDF',
    term: 'Comprehensive Academic Specification Whitepaper',
    desc: 'Downloads the complete 15-page academic document containing mathematical proofs, algorithm pseudocode, and benchmark results.',
    formula: 'WSN_Coverage_Optimization_Complete_Guide.pdf'
  },
  'hud-cr': {
    badge: 'Primary Metric',
    badgeClass: '',
    title: 'Coverage Ratio (CR)',
    term: 'Monitored Field Area Fraction',
    desc: 'The proportion of the 10,000 m² target terrain monitored by at least one operational sensor. Standard benchmark achieves 96.94% with EA-VVF-MOPSO.',
    formula: 'CR = [Area(⋃ Dᵢ) / Area(A_field)] × 100%'
  },
  'hud-or': {
    badge: 'Redundancy Metric',
    badgeClass: 'badge-amber',
    title: 'Overlap Redundancy (OR)',
    term: 'Multi-Sensor Coverage Redundancy',
    desc: 'The percentage of covered territory monitored simultaneously by 2 or more sensors. Lower values conserve network energy while preserving fault tolerance.',
    formula: 'OR = [Area(Multiplicity ≥ 2) / Area(Covered)] × 100%'
  },
  'hud-hr': {
    badge: 'Deficit Metric',
    badgeClass: 'badge-amber',
    title: 'Blindspot Ratio (HR)',
    term: 'Unmonitored Coverage Holes',
    desc: 'The percentage of the field left unmonitored by any sensor. Optimization drives this value down from 15%+ to under 3.1%.',
    formula: 'HR = 100% - CR'
  },
  'hud-fnd': {
    badge: 'Lifetime Metric',
    badgeClass: 'badge-purple',
    title: 'First Node Dead (FND)',
    term: 'Initial Battery Depletion Horizon',
    desc: 'The exact operational round when the first sensor node exhausts its energy. Hybrid protocol achieves Round 275+ (5.94x longer than LEACH).',
    formula: 'FND = min { Round r | ∃ node i : E_residual(i) ≤ 0 }'
  },
  'hud-k': {
    badge: 'Multiplicity Metric',
    badgeClass: '',
    title: 'Mean Multiplicity (K)',
    term: 'Degree of Sensing Redundancy',
    desc: 'The average number of distinct sensors covering each monitored grid point. K ≈ 3 provides robust multi-sensor confirmation.',
    formula: 'K = (1 / Area(Covered)) ∫∫ k(x, y) dx dy'
  },
  'nav-3d': {
    badge: 'Simulation View',
    badgeClass: '',
    title: '3D Field Topology',
    term: 'WebGL Three.js Spatial Environment',
    desc: 'Interactive 3D virtual environment rendering physical sensor coordinates, translucent sensing disks, radio link topology, and animated packet streams.',
    formula: 'PBR Shading • Orthographic / Perspective Raycasting'
  },
  'nav-2d': {
    badge: 'Analytical Matrix',
    badgeClass: 'badge-purple',
    title: 'Voronoi & Multiplicity Heatmap',
    term: 'Vectorized Discrete Grid & Bounded Tessellation',
    desc: 'High-speed 1m discrete matrix heatmap and planar Voronoi partitions identifying localized sensor density and frontier boundary holes.',
    formula: 'V(sᵢ) = { p ∈ ℝ² | ||p - sᵢ|| ≤ ||p - sⱼ|| ∀ j ≠ i }'
  },
  'nav-routing': {
    badge: 'Protocol Lab',
    badgeClass: 'badge-emerald',
    title: 'Routing Protocols & Lifecycle',
    term: 'Multi-Hop Energy Dissipation Benchmark',
    desc: '1000-round lifecycle comparison of Hybrid LEACH-PEGASIS against PEGASIS and LEACH, featuring live energy decay curves and FND charts.',
    formula: 'Heinzelman First-Order Radio Energy Model'
  },
  'nav-code': {
    badge: 'Implementation',
    badgeClass: '',
    title: 'Algorithm Source Code',
    term: 'Production Python & JS Implementation',
    desc: 'Syntax-highlighted codebase explorer displaying the exact implementation of EA-VVF-MOPSO, virtual force physics, and clustering logic.',
    formula: 'PEP 8 Python 3.10+ / ES2022 Architecture'
  },
  'nav-theory': {
    badge: 'Mathematical Foundations',
    badgeClass: 'badge-purple',
    title: 'Formulation & Theory',
    term: 'Mathematical Proofs & Scientific Models',
    desc: 'Rigorous mathematical formulations for coverage integrals, overlap intersections, radio propagation equations, and Pareto optimization objectives.',
    formula: 'Threshold d₀ = √(ε_fs / ε_mp) = 87.7m'
  },
  'btn-export-menu': {
    badge: 'Publication Tools',
    badgeClass: 'badge-purple',
    title: 'Export Research Data & Figures',
    term: 'Open Science & Empirical Reproducibility',
    desc: 'Opens the export suite to download complete sensor topology CSV tables, structured JSON telemetry reports, and high-DPI publication figures.',
    formula: 'Standards: RFC 4180 CSV • IEEE Figure Quality'
  },
  'btn-export-csv': {
    badge: 'Dataset Exporter',
    badgeClass: '',
    title: 'Topology Dataset (.CSV)',
    term: 'Tabular Sensor Coordinates & Energy Matrix',
    desc: 'Downloads an RFC-compliant CSV containing node IDs, planar coordinates (X, Y), displacement from initial positions, residual energy, and Base Station distance.',
    formula: '[ID, X, Y, InitX, InitY, Disp, Rs, Rc, Energy, CH, DistSink]'
  },
  'btn-export-json': {
    badge: 'Telemetry Exporter',
    badgeClass: 'badge-emerald',
    title: 'Metrics Telemetry (.JSON)',
    term: 'Machine-Readable Empirical Experiment Log',
    desc: 'Generates a detailed JSON report capturing field dimensions, scenario metadata, active metrics (CR, OR, HR, K), and downstream routing longevity.',
    formula: '{ metadata, parameters, performance_metrics, nodes }'
  },
  'btn-export-snapshot': {
    badge: 'Graphics Exporter',
    badgeClass: 'badge-amber',
    title: 'Publication Figure Snapshot (.PNG)',
    term: 'Lossless WebGL Framebuffer Capture',
    desc: 'Captures the active 3D WebGL scene at native display resolution as a lossless PNG graphic ready for LaTeX papers and slides.',
    formula: 'Renderer Canvas DataURL (MIME: image/png, Lossless)'
  },
  'obstacle-preset-select': {
    badge: 'Environmental Constraints',
    badgeClass: 'badge-amber',
    title: 'Terrain Constraints & Obstacles',
    term: 'Physical Boundary Exclusion & Barrier Repulsion',
    desc: 'Simulates physical terrain barriers (water bodies, structural walls, exclusion hazard perimeters) where sensors cannot reside. Virtual force gradients automatically deflect swarm nodes into valid terrain.',
    formula: 'F_obs = k_obs · ((d_safe - d) / d_safe)² · n_repulsive'
  },
  'poi-preset-select': {
    badge: 'Dynamic Tracking',
    badgeClass: 'badge-emerald',
    title: 'Mission Targets & POI Tracking',
    term: 'Virtual Attractive Potential Well (F_poi)',
    desc: 'Simulates high-value stationary targets or mobile dynamic intruders. Nodes experience a directed virtual gravitational attraction toward targets, concentrating coverage density while balancing inter-node repulsion.',
    formula: 'F_poi = k_poi · w_target · ((R_attract - d) / R_attract) · n_target'
  },
  'chart-radar': {
    badge: 'Multi-Objective Analysis',
    badgeClass: 'badge-purple',
    title: 'Algorithm Trade-Off Radar',
    term: '5-Dimensional Pareto Trade-Off Polygon',
    desc: 'Compares the proposed EA-VVF-MOPSO against chosen competitors across Coverage, Hole Eradication, Overlap Control, Energy Conservation, and Lifetime.',
    formula: 'Normalized Axes: [CR, 100-HR, 100-OR, Retained E₀, FND]'
  },
  'viewport-toolbar': {
    badge: 'Direct Spatial Manipulation',
    badgeClass: 'badge-amber',
    title: 'Interactive Topology Workbench',
    term: 'Human-in-the-Loop Spatial Reconfiguration',
    desc: 'Empowers researchers to directly manipulate swarm architecture: grab and drag sensor nodes, inject custom micro-sensors onto blindspots, or decommission nodes to test fault-tolerant coverage resilience.',
    formula: 'Interactive Modes: [Inspect / Orbit, Relocate Node, Inject Node, Decommission]'
  },
  'duty-cycle-select': {
    badge: 'Energy Scheduling',
    badgeClass: 'badge-indigo',
    title: 'Sleep/Wake Scheduling & Solar Harvesting',
    term: 'Dynamic Coordinated Dormancy & Energy Scavenging',
    desc: 'Identifies high-redundancy sensors and shifts them into ultra-low-power sleep states while safeguarding 100% field coverage. In harvesting mode, dormant nodes trickle-charge residual batteries via ambient solar energy (+0.15 mJ/round).',
    formula: 'E_round = isSleeping ? (E_sleep - E_solar) : (E_tx + E_rx)'
  },
  'jammer-preset-select': {
    badge: 'Electronic Warfare',
    badgeClass: 'badge-rose',
    title: 'RF Jamming & Cyber-Interference',
    term: 'Signal-to-Interference-plus-Noise Ratio (SINR)',
    desc: 'Simulates localized high-power electronic countermeasures (ECM). Transmissions crossing the jamming perimeter experience heavy packet drops and severe noise-floor dissipation.',
    formula: 'SINR = P_rx / (N₀ + P_jammer) < γ_threshold'
  },
  'slider-path-loss': {
    badge: 'Radio Propagation',
    badgeClass: 'badge-amber',
    title: 'Path Loss Exponent (α)',
    term: 'Log-Distance Wireless Path Loss Model',
    desc: 'Models electromagnetic wave decay across physical environments: from free-space vacuum (α=2.0) to obstructed indoor foliage (α=3.0) and dense urban multipath shadowing (α=4.0).',
    formula: 'PL(d) ∝ (d / d₀)^α • E_tx(d) ∝ d^α'
  },
  'btn-trigger-emp': {
    badge: 'Fault Injection',
    badgeClass: 'badge-rose',
    title: 'Regional EMP Shockwave Blast',
    term: 'Catastrophic Cyber-Physical Swarm Shock',
    desc: 'Detonates an electromagnetic pulse shockwave that instantly neutralizes sensor batteries within a 25m perimeter, benchmarking the surviving swarm’s dynamic wake-up and route self-healing.',
    formula: 'E_node = dist(s_i, s_emp) ≤ R_emp ? 0.0005J : E_node'
  }
};

function initControlExplainer() {
  const popover = document.getElementById('control-explainer-popover');
  if (!popover) return;

  let activeEl = null;

  function updatePosition(clientX, clientY) {
    const popWidth = popover.offsetWidth || 320;
    const popHeight = popover.offsetHeight || 170;
    const padding = 16;

    let posX = clientX + 16;
    let posY = clientY + 16;

    // Flip horizontally if clipping right window edge
    if (posX + popWidth > window.innerWidth - padding) {
      posX = clientX - popWidth - 14;
    }
    // Flip vertically if clipping bottom window edge
    if (posY + popHeight > window.innerHeight - padding) {
      posY = clientY - popHeight - 14;
    }

    // Keep within viewport bounds
    if (posX < padding) posX = padding;
    if (posY < padding) posY = padding;

    popover.style.left = `${posX}px`;
    popover.style.top = `${posY}px`;
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-explain]');
    if (!target) return;
    const key = target.getAttribute('data-explain');
    const data = EXPLAINER_DATA[key];
    if (!data) return;

    activeEl = target;
    const badgeClass = data.badgeClass || '';
    
    popover.innerHTML = `
      <div class="explainer-header">
        <div class="explainer-title">${data.title}</div>
        <span class="explainer-badge ${badgeClass}">${data.badge}</span>
      </div>
      <div class="explainer-term-box">
        <span class="explainer-term-label">Term:</span>
        <span class="explainer-term-val">${data.term}</span>
      </div>
      <div class="explainer-desc">${data.desc}</div>
      ${data.formula ? `<div class="explainer-formula"><code>${data.formula}</code></div>` : ''}
    `;

    popover.classList.add('active');
    updatePosition(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', (e) => {
    if (!activeEl) return;
    updatePosition(e.clientX, e.clientY);
  });

  document.addEventListener('mouseout', (e) => {
    if (!activeEl) return;
    const related = e.relatedTarget;
    if (!related || !activeEl.contains(related)) {
      activeEl = null;
      popover.classList.remove('active');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

