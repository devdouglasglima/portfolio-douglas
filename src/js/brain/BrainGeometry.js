import * as THREE from 'three';

/* ── SDF helpers ── */

function cerebrumSDF(x, y, z) {
  return (x / 1.05) ** 2 + ((y - 0.05) / 0.88) ** 2 + (z / 0.78) ** 2 - 1.0;
}

function cerebellumSDF(x, y, z) {
  return (x / 0.44) ** 2 + ((y + 0.72) / 0.30) ** 2 + ((z + 0.52) / 0.44) ** 2 - 1.0;
}

function isInsideBrain(x, y, z) {
  const inCerebrum    = cerebrumSDF(x, y, z) <= 0;
  const inFissure     = Math.abs(x) < 0.09 && y > 0.28 && cerebrumSDF(x, y, z) < -0.12;
  const inCerebellum  = cerebellumSDF(x, y, z) <= 0;
  return (inCerebrum && !inFissure) || inCerebellum;
}

function isNearSurface(x, y, z, eps = 0.07) {
  if (!isInsideBrain(x, y, z)) return false;
  // expande levemente e checa se saiu da forma
  const f = 1.0 + eps;
  return !isInsideBrain(x * f, y * f, z * f);
}

/* ── Gradiente de cor (azul → ciano → violeta) ── */
function colorAt(x, y, z) {
  const dist = Math.sqrt(x * x + y * y + z * z);
  const t    = Math.min(dist / 1.15, 1.0);

  let r, g, b;
  if (t < 0.5) {
    const s = t / 0.5;
    r = 0.310 + (0.0   - 0.310) * s;
    g = 0.498 + (0.831 - 0.498) * s;
    b = 1.0;
  } else {
    const s = (t - 0.5) / 0.5;
    r = 0.0   + (0.486 - 0.0)   * s;
    g = 0.831 + (0.231 - 0.831) * s;
    b = 1.0   + (0.929 - 1.0)   * s;
  }
  return [r, g, b];
}

/**
 * Gera a geometria de partículas do cérebro.
 * @param {number} count - número de partículas
 * @returns {THREE.BufferGeometry}
 */
export function createBrainGeometry(count) {
  /* 55% surface + 45% volume */
  const surfaceCount = Math.floor(count * 0.55);
  const volumeCount  = count - surfaceCount;

  const positions      = [];
  const scatterPos     = [];
  const exitPos        = [];
  const colors         = [];
  const randoms        = [];

  function pushParticle(x, y, z) {
    positions.push(x, y, z);

    /* Posição de dispersão inicial (scattered) */
    const r     = 7 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    scatterPos.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    /* Posição de saída (explosão radial) */
    const len   = Math.sqrt(x * x + y * y + z * z) || 0.001;
    const scale = 4.5 + Math.random() * 4;
    exitPos.push(
      (x / len) * scale + (Math.random() - 0.5) * 1.5,
      (y / len) * scale + (Math.random() - 0.5) * 1.5,
      (z / len) * scale + (Math.random() - 0.5) * 1.5
    );

    colors.push(...colorAt(x, y, z));
    randoms.push(Math.random());
  }

  /* ── Partículas de superfície ── */
  let generated = 0;
  let tries = 0;
  while (generated < surfaceCount && tries < surfaceCount * 60) {
    tries++;
    const x = (Math.random() - 0.5) * 2.5;
    const y = (Math.random() - 0.5) * 2.3;
    const z = (Math.random() - 0.5) * 2.2;
    if (isNearSurface(x, y, z, 0.08)) {
      pushParticle(x, y, z);
      generated++;
    }
  }

  /* ── Partículas de volume ── */
  generated = 0;
  tries = 0;
  while (generated < volumeCount && tries < volumeCount * 20) {
    tries++;
    const x = (Math.random() - 0.5) * 2.5;
    const y = (Math.random() - 0.5) * 2.3;
    const z = (Math.random() - 0.5) * 2.2;
    if (isInsideBrain(x, y, z) && !isNearSurface(x, y, z, 0.08)) {
      pushParticle(x, y, z);
      generated++;
    }
  }

  /* ── Buffer Geometry ── */
  const geometry = new THREE.BufferGeometry();
  const n = positions.length / 3;

  geometry.setAttribute('position',    new THREE.BufferAttribute(new Float32Array(positions),  3));
  geometry.setAttribute('aScatterPos', new THREE.BufferAttribute(new Float32Array(scatterPos), 3));
  geometry.setAttribute('aExitPos',    new THREE.BufferAttribute(new Float32Array(exitPos),    3));
  geometry.setAttribute('aColor',      new THREE.BufferAttribute(new Float32Array(colors),     3));
  geometry.setAttribute('aRandom',     new THREE.BufferAttribute(new Float32Array(randoms),    1));

  console.log(`[Brain] ${n} partículas geradas.`);
  return geometry;
}
