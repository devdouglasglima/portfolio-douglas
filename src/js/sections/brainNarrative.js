import { setState, subscribe } from '../store.js';

/**
 * Configura o ScrollTrigger do GSAP para a seção do cérebro
 * e gerencia a visibilidade dos textos narrativos.
 */
export function initBrainNarrative() {
  const gsap          = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    console.warn('[Brain] GSAP/ScrollTrigger não encontrado.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.getElementById('brain-wrapper');
  if (!wrapper) return;

  /* Rastreia o progresso sem `pin` — CSS sticky cuida do visual */
  ScrollTrigger.create({
    trigger: wrapper,
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.2,
    onUpdate(self) {
      setState({ scrollProgress: self.progress });
    },
  });

  /* ── Visibilidade dos conceitos ── */
  const concepts = document.querySelectorAll('.brain-concept');

  subscribe(state => {
    const p = state.scrollProgress;

    concepts.forEach(el => {
      const from = parseFloat(el.dataset.showFrom);
      const to   = parseFloat(el.dataset.showTo);

      let opacity = 0;
      if (p >= from && p <= to) {
        const range   = to - from;
        const fadeLen = Math.min(0.04, range * 0.25);
        opacity = Math.min(
          (p - from)  / fadeLen,
          (to   - p)  / fadeLen,
          1.0
        );
        opacity = Math.max(0, opacity);
      }

      el.style.opacity   = opacity;
      el.style.transform =
        `translateY(calc(-50% + ${(1 - opacity) * 18}px))`;
    });
  });
}
