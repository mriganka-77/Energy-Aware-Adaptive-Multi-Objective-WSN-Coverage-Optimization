/**
 * ============================================================================
 * WSN SPATIAL TOPOLOGY & MULTI-HOP ROUTING LABORATORY
 * Precision Dark Theme • 3D Motion Theme • Physics Force Optimizer
 * Hardware Telemetry & First-Order Radio Energy Dissipation Model
 * ============================================================================
 */

import * as THREE from 'three';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// ============================================================================
// 1. GLOBAL APPLICATION STATE
// ============================================================================
const STATE = {
  activeTab: '3d-sim',
  numSensors: 50,
  sensingRadius: 15,
  commRadius: 30,
  fieldWidth: 100,
  fieldHeight: 100,
  seed: 42,
  activeAlgorithm: 'random',
  isOptimizing: false,
  isOptimized: false,
  showBubbles: true,
  isOrbitCam: false,
  audioEnabled: true,
  nodes: [],
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
    energy: null
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
    } catch (_) {}
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
    } catch (_) {}
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
    } catch (_) {}
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
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateDeployments() {
  const rng = pseudoRandom(STATE.seed);
  STATE.nodes = [];
  
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
      isLocked: (i % 6 === 0)
    });
  }
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

function runRealTimeOptimizationStep(algo = 'ea-vvf-mopso') {
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

  // 2. Attractive Forces toward Unmonitored Blindspots
  if (algo === 'ea-vvf-mopso' || algo === 'vfa') {
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
          const pullMag = 1.4 * (dist / (thresholdDist * 2.5));
          const angle = Math.atan2(dy, dx);
          forces[i].fx += pullMag * Math.cos(angle);
          forces[i].fy += pullMag * Math.sin(angle);
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

  // 4. Physical Position Update
  const stepSize = algo === 'ea-vvf-mopso' ? 1.6 : (algo === 'vfa' ? 2.0 : 1.2);
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
let nodeGroup, diskGroup, linkGroup, routingBeamGroup, packetGroup, dustParticlesGroup;
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

  scene.add(diskGroup);
  scene.add(linkGroup);
  scene.add(routingBeamGroup);
  scene.add(nodeGroup);
  scene.add(packetGroup);

  rebuildSceneMeshes();

  // Raycaster & Mouse setup
  raycaster = new THREE.Raycaster();
  mouseNorm = new THREE.Vector2(-999, -999);

  // Mouse Interaction (Orbit control + Raycast + Parallax)
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
    STATE.isOrbitCam = false;
    updateOrbitButtonUI();
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Subtle 3D Camera Parallax
    parallaxOffset.x = mouseNorm.x * 9.0;
    parallaxOffset.y = mouseNorm.y * 6.0;

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

function rebuildSceneMeshes() {
  if (!nodeGroup) return;

  while (nodeGroup.children.length) nodeGroup.remove(nodeGroup.children[0]);
  while (diskGroup.children.length) diskGroup.remove(diskGroup.children[0]);
  while (linkGroup.children.length) linkGroup.remove(linkGroup.children[0]);

  const nodes = STATE.nodes;
  const sphereGeo = new THREE.SphereGeometry(STATE.sensingRadius, 24, 16);

  nodes.forEach((node) => {
    const isAlive = (node.energy > 0.001);

    // 1. Translucent Sensing Disks
    if (isAlive && STATE.showBubbles) {
      const diskMat = new THREE.MeshStandardMaterial({
        color: node.isCH ? 0xFBBF24 : (STATE.isOptimized ? 0x10B981 : 0x38BDF8),
        transparent: true,
        opacity: node.isCH ? 0.2 : 0.11,
        roughness: 0.15,
        metalness: 0.2
      });
      const disk = new THREE.Mesh(sphereGeo, diskMat);
      disk.position.set(node.x, node.y, 0);
      disk.scale.set(1, 1, 0.15);
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
      roughness: 0.25
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.rotation.x = Math.PI / 2;
    nodeContainer.add(shell);

    // Recessed LED Core
    const coreGeo = new THREE.SphereGeometry(node.isCH ? 1.7 : 1.25, 16, 16);
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

  updateFlyingPackets();

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
window.setCameraView = function(mode) {
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

window.toggleOrbitCam = function() {
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

window.toggleSensingBubbles = function() {
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

    ctx.beginPath();
    ctx.arc(nx, ny, node.isCH ? 4.5 : 3.0, 0, Math.PI * 2);
    ctx.fillStyle = node.isCH ? '#FBBF24' : '#F1F5F9';
    ctx.fill();
    ctx.strokeStyle = '#07090E';
    ctx.lineWidth = 1.2;
    ctx.stroke();
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

    ctx.beginPath();
    ctx.arc(nx, ny, rPixels, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(nx, ny, node.isCH ? 4.5 : 3.0, 0, Math.PI * 2);
    ctx.fillStyle = node.isCH ? '#FBBF24' : '#38BDF8';
    ctx.fill();
    ctx.strokeStyle = '#07090E';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });
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

  const k = 8000;
  const E_elec = 50e-9;
  const eps_fs = 50e-12;
  const eps_mp = 0.0013e-12;
  const d0 = Math.sqrt(eps_fs / eps_mp);
  const sinkX = 50, sinkY = 135;

  function txEnergy(dist) {
    return dist < d0 ? k * (E_elec + eps_fs * (dist ** 2)) : k * (E_elec + eps_mp * (dist ** 4));
  }

  if (protocol === 'leach') {
    const numCH = Math.max(1, Math.round(aliveNodes.length * 0.10));
    const chNodes = [...aliveNodes].sort(() => Math.random() - 0.5).slice(0, numCH);
    chNodes.forEach(ch => ch.isCH = true);

    const nonCH = aliveNodes.filter(n => !n.isCH);
    nonCH.forEach(node => {
      let nearestCH = chNodes[0];
      let minDist = Math.hypot(node.x - nearestCH.x, node.y - nearestCH.y);
      for (const ch of chNodes) {
        const d = Math.hypot(node.x - ch.x, node.y - ch.y);
        if (d < minDist) { minDist = d; nearestCH = ch; }
      }

      drawRoutingBeam(node.x, node.y, 1.6, nearestCH.x, nearestCH.y, 1.6, 0xF43F5E, 0.4);
      spawnFlyingPacket(node.x, node.y, 1.6, nearestCH.x, nearestCH.y, 1.6, 0xF43F5E);
      node.energy = Math.max(0, node.energy - txEnergy(minDist));
      nearestCH.energy = Math.max(0, nearestCH.energy - (k * E_elec + 5e-9 * k));
    });

    chNodes.forEach(ch => {
      const dToSink = Math.hypot(ch.x - sinkX, ch.y - sinkY);
      drawRoutingBeam(ch.x, ch.y, 1.6, sinkX, sinkY, 17, 0xF43F5E, 0.85);
      spawnFlyingPacket(ch.x, ch.y, 1.6, sinkX, sinkY, 17, 0xF43F5E);
      ch.energy = Math.max(0, ch.energy - txEnergy(dToSink));
      routingSimState.packetsDelivered++;
    });

  } else if (protocol === 'pegasis') {
    const unvisited = [...aliveNodes];
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
      drawRoutingBeam(u.x, u.y, 1.6, v.x, v.y, 1.6, 0x38BDF8, 0.55);
      spawnFlyingPacket(u.x, u.y, 1.6, v.x, v.y, 1.6, 0x38BDF8);
      u.energy = Math.max(0, u.energy - txEnergy(d));
      v.energy = Math.max(0, v.energy - (k * E_elec + 5e-9 * k));
    }

    const leader = chain[Math.floor(chain.length / 2)];
    leader.isCH = true;
    const dToSink = Math.hypot(leader.x - sinkX, leader.y - sinkY);
    drawRoutingBeam(leader.x, leader.y, 1.6, sinkX, sinkY, 17, 0x38BDF8, 0.85);
    spawnFlyingPacket(leader.x, leader.y, 1.6, sinkX, sinkY, 17, 0x38BDF8);
    leader.energy = Math.max(0, leader.energy - txEnergy(dToSink));
    routingSimState.packetsDelivered++;

  } else {
    // HYBRID LEACH-PEGASIS
    const numCH = Math.max(1, Math.round(aliveNodes.length * 0.05));
    const chNodes = [...aliveNodes].sort((a, b) => b.energy - a.energy).slice(0, numCH);
    chNodes.forEach(ch => ch.isCH = true);

    const nonCH = aliveNodes.filter(n => !n.isCH);
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
        drawRoutingBeam(m.x, m.y, 1.6, cl.ch.x, cl.ch.y, 1.6, 0x10B981, 0.45);
        spawnFlyingPacket(m.x, m.y, 1.6, cl.ch.x, cl.ch.y, 1.6, 0x10B981);
        m.energy = Math.max(0, m.energy - (txEnergy(d) * 0.7));
        cl.ch.energy = Math.max(0, cl.ch.energy - (k * E_elec * 0.4));
      }
    });

    chNodes.forEach(ch => {
      const dToSink = Math.hypot(ch.x - sinkX, ch.y - sinkY);
      if (dToSink < 75 || chNodes.length === 1) {
        drawRoutingBeam(ch.x, ch.y, 1.6, sinkX, sinkY, 17, 0x34D399, 0.95);
        spawnFlyingPacket(ch.x, ch.y, 1.6, sinkX, sinkY, 17, 0x34D399);
        ch.energy = Math.max(0, ch.energy - txEnergy(dToSink));
      } else {
        let forwardCH = chNodes.find(other => other !== ch && Math.hypot(other.x - sinkX, other.y - sinkY) < dToSink) || ch;
        const dHop = Math.hypot(ch.x - forwardCH.x, ch.y - forwardCH.y);
        drawRoutingBeam(ch.x, ch.y, 1.6, forwardCH.x, forwardCH.y, 1.6, 0x34D399, 0.75);
        spawnFlyingPacket(ch.x, ch.y, 1.6, forwardCH.x, forwardCH.y, 1.6, 0x34D399);
        ch.energy = Math.max(0, ch.energy - txEnergy(dHop));
      }
      routingSimState.packetsDelivered++;
    });
  }

  SFX.packetArrive();
  triggerBaseStationPulse();

  rebuildSceneMeshes();
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
  if (routingBeamGroup) {
    while (routingBeamGroup.children.length) routingBeamGroup.remove(routingBeamGroup.children[0]);
  }
  if (packetGroup) {
    while (packetGroup.children.length) packetGroup.remove(packetGroup.children[0]);
  }
  activePackets = [];

  rebuildSceneMeshes();
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

window.viewCodeFile = function(fileName) {
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

      STATE.isOptimized = false;
      generateDeployments();
      rebuildSceneMeshes();
      compute2DGridMetrics();
    });
  }

  // Optimization Button
  const optBtn = document.getElementById('btn-run-optimization');
  const algoSelect = document.getElementById('select-algorithm');
  if (optBtn) {
    optBtn.addEventListener('click', () => {
      SFX.click();
      const selectedAlgo = algoSelect ? algoSelect.value : 'ea-vvf-mopso';
      optBtn.innerText = `Optimizing via ${selectedAlgo.toUpperCase()}...`;
      optBtn.disabled = true;

      let steps = 0;
      const maxSteps = selectedAlgo === 'ea-vvf-mopso' ? 35 : (selectedAlgo === 'vfa' ? 30 : 25);
      const interval = setInterval(() => {
        runRealTimeOptimizationStep(selectedAlgo);
        rebuildSceneMeshes();
        compute2DGridMetrics();
        SFX.optimizePulse();
        steps++;

        if (steps >= maxSteps) {
          clearInterval(interval);
          STATE.isOptimized = true;
          STATE.activeAlgorithm = selectedAlgo;
          rebuildSceneMeshes();
          compute2DGridMetrics();
          optBtn.innerText = `Deployment Optimized (${selectedAlgo.toUpperCase()})`;
          optBtn.disabled = false;
        }
      }, 40);
    });
  }

  // Reset Button
  const resetBtn = document.getElementById('btn-reset-deployment');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      SFX.click();
      STATE.activeAlgorithm = 'random';
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
