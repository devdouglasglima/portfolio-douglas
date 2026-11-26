import * as THREE from 'three';
import { createBrainGeometry } from './BrainGeometry.js';
import { vertexShader, fragmentShader } from './shaders.js';
import { getState, subscribe } from '../store.js';
import { PARTICLE_COUNTS, MAX_PIXEL_RATIOS } from '../utils/performance.js';

let renderer, scene, camera, particlesMesh, clock;
let animationId = null;

/**
 * Inicializa e começa a renderizar a cena do cérebro.
 * @param {HTMLCanvasElement} canvas
 * @param {string} deviceTier
 */
export function initBrainScene(canvas, deviceTier) {
  const count = PARTICLE_COUNTS[deviceTier];
  if (count === 0) return; // tier 'low' sem WebGL

  /* ── Renderer ── */
  const maxDPR = MAX_PIXEL_RATIOS[deviceTier];
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setClearColor(0x07070F, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  /* ── Scene ── */
  scene = new THREE.Scene();

  /* ── Camera ── */
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.25, 3.6);
  camera.lookAt(0, 0, 0);

  /* ── Partículas ── */
  const geometry = createBrainGeometry(count);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uPhase:      { value: 0.0 },
      uTime:       { value: 0.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, maxDPR) },
    },
    transparent:  true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
  });

  particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  /* ── Clock ── */
  clock = new THREE.Clock();

  /* ── Resize ── */
  window.addEventListener('resize', onResize);

  /* ── Loop ── */
  animate();

  /* ── Subscribe ao store ── */
  subscribe(state => {
    if (particlesMesh) {
      particlesMesh.material.uniforms.uPhase.value = state.scrollProgress;
    }
  });
}

function onResize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (!particlesMesh) return;

  const elapsed = clock.getElapsedTime();
  particlesMesh.material.uniforms.uTime.value = elapsed;

  renderer.render(scene, camera);
}

/** Para o loop de renderização (cleanup) */
export function disposeBrainScene() {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
  if (particlesMesh) {
    particlesMesh.geometry.dispose();
    particlesMesh.material.dispose();
  }
  if (renderer) renderer.dispose();
}
