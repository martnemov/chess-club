const REVEAL_SELECTOR = '.stage-card, .lecture__inner, .tournament__inner';

export function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const revealEls = document.querySelectorAll(REVEAL_SELECTOR);

  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}
