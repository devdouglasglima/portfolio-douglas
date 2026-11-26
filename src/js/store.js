/**
 * Store global simples — substitui Zustand no ambiente vanilla JS.
 * Permite que GSAP (imperativo) e Three.js (via requestAnimationFrame)
 * compartilhem estado sem re-renders do DOM.
 */

const _state = {
  scrollProgress: 0,   // 0 → 1 (progresso no brain-wrapper)
  brainPhase: 0,       // calculado a partir de scrollProgress
  reducedMotion: false,
  webGLSupported: true,
  deviceTier: 'high',  // 'high' | 'mid' | 'low'
};

const _listeners = new Set();

/** Lê o estado atual sem trigger de re-render */
export function getState() {
  return _state;
}

/** Atualiza campos e notifica subscribers */
export function setState(updates) {
  Object.assign(_state, updates);
  _listeners.forEach(fn => fn(_state));
}

/** Registra um listener; retorna função de cleanup */
export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
