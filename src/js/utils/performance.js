/**
 * Detecta o tier de performance do dispositivo.
 * Retorna 'high' | 'mid' | 'low'.
 */
export function getDeviceTier() {
  // Sem WebGL → low
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'low';

  // Mobile user agent → mid no máximo
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // GPU string
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';

  // Intel integrada ou GPU de baixo custo → mid
  const isIntegrated = /Intel|Mesa|SwiftShader|llvmpipe/i.test(renderer);

  // deviceMemory API (Chrome)
  const memory = navigator.deviceMemory || 4;

  if (isMobile || isIntegrated || memory < 4) return 'mid';
  return 'high';
}

/** Mapa de contagem de partículas por tier */
export const PARTICLE_COUNTS = { high: 8000, mid: 3500, low: 0 };

/** Mapa de pixel ratio máximo por tier */
export const MAX_PIXEL_RATIOS = { high: 2, mid: 1.5, low: 1 };
