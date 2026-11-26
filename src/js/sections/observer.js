/**
 * Intersection Observer para animações de entrada em seções.
 * Adiciona .is-visible a elementos com .reveal e .reveal-stagger.
 */
export function initRevealObserver() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger, .case');

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/**
 * Observer para animar linhas SVG nos diagramas.
 */
export function initDiagramObserver() {
  const diagrams = document.querySelectorAll('.case__diagram');

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.diagram-line').forEach(l => l.classList.add('diagram-line--active'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = entry.target.querySelectorAll('.diagram-line');
          lines.forEach((line, i) => {
            setTimeout(() => line.classList.add('diagram-line--active'), i * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  diagrams.forEach(d => observer.observe(d));
}
