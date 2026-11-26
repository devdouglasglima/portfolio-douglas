/**
 * Shaders GLSL para o sistema de partículas do cérebro.
 */

export const vertexShader = /* glsl */`
  attribute vec3 aScatterPos;
  attribute vec3 aExitPos;
  attribute float aRandom;
  attribute vec3 aColor;

  uniform float uPhase;      // progresso do scroll: 0.0 → 1.0
  uniform float uTime;       // tempo em segundos
  uniform float uPixelRatio; // device pixel ratio

  varying vec3 vColor;
  varying float vOpacity;

  float smoothphase(float a, float b, float t) {
    float x = clamp((t - a) / (b - a + 0.0001), 0.0, 1.0);
    return x * x * (3.0 - 2.0 * x);
  }

  void main() {
    vec3 pos;
    float alpha = 1.0;

    /* ── Fase 0: Formação (0.0 → 0.15) ── */
    if (uPhase < 0.15) {
      float t = smoothphase(0.0, 0.15, uPhase);
      pos   = mix(aScatterPos, position, t);
      alpha = t;

    /* ── Fases 1-5: Cérebro visível (0.15 → 0.75) ── */
    } else if (uPhase < 0.75) {
      pos = position;

      /* Flutuação suave */
      float ff    = 0.4 + aRandom * 0.4;
      float fade  = smoothphase(0.70, 0.75, uPhase);
      float amt   = 0.025 * (1.0 - fade);
      pos.x += sin(uTime * ff       + aRandom * 6.2832) * amt;
      pos.y += cos(uTime * ff * 0.8 + aRandom * 6.2832) * amt;
      pos.z += sin(uTime * ff * 0.6 + aRandom * 6.2832) * amt;

      /* Rotação Y contínua */
      float rampIn  = smoothphase(0.15, 0.30, uPhase);
      float rampOut = 1.0 - smoothphase(0.68, 0.75, uPhase);
      float angle   = uTime * 0.18 * rampIn * rampOut;
      float c = cos(angle);
      float s = sin(angle);
      pos = vec3(
        c * pos.x + s * pos.z,
        pos.y,
       -s * pos.x + c * pos.z
      );

    /* ── Fase 6: Dispersão (0.75 → 1.0) ── */
    } else {
      float t = smoothphase(0.75, 1.0, uPhase);
      float t2 = t * t;
      pos   = mix(position, aExitPos, t2);
      alpha = 1.0 - t * 0.95;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    /* Tamanho com atenuação de profundidade */
    float depth    = gl_Position.w;
    float baseSize = 1.8 + aRandom * 2.2;
    gl_PointSize   = baseSize * (260.0 / depth) * uPixelRatio;
    gl_PointSize   = clamp(gl_PointSize, 0.4, 7.0);

    vColor   = aColor;
    vOpacity = alpha;
  }
`;

export const fragmentShader = /* glsl */`
  precision mediump float;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);

    /* Círculo suave */
    float circle = smoothstep(0.5, 0.12, d);
    /* Glow interior */
    float glow   = smoothstep(0.5, 0.0, d) * 0.35;

    if (circle < 0.01) discard;

    vec3 color = vColor + glow * vec3(0.4, 0.6, 1.0);
    gl_FragColor = vec4(color, circle * vOpacity);
  }
`;
