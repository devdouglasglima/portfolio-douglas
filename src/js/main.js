/**
 * main.js — Entry point do portfólio.
 * Orquestra a inicialização de todos os módulos.
 */

import { isWebGLSupported, prefersReducedMotion } from './utils/webgl.js';
import { getDeviceTier } from './utils/performance.js';
import { setState } from './store.js';
import { initBrainScene } from './brain/BrainScene.js';
import { initBrainNarrative } from './sections/brainNarrative.js';
import { initRevealObserver, initDiagramObserver } from './sections/observer.js';

/* ── Detectar capacidades ── */
const webGL    = isWebGLSupported();
const reduced  = prefersReducedMotion();
const tier     = getDeviceTier();

setState({ reducedMotion: reduced, webGLSupported: webGL, deviceTier: tier });

/* ── Header scroll ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Brain 3D ── */
const brainCanvas  = document.getElementById('brain-canvas');
const brainFallback = document.getElementById('brain-fallback');

if (webGL && !reduced && brainCanvas) {
  initBrainScene(brainCanvas, tier);
  initBrainNarrative();
} else {
  /* Fallback: esconde canvas, mostra conteúdo estático */
  if (brainCanvas)   brainCanvas.style.display = 'none';
  if (brainFallback) brainFallback.classList.add('is-active');
}

/* ── Animações de entrada (IntersectionObserver) ── */
initRevealObserver();
initDiagramObserver();

/* ── Log de ambiente ── */
console.log(`[Portfolio] WebGL: ${webGL} | Reduced motion: ${reduced} | Tier: ${tier}`);
