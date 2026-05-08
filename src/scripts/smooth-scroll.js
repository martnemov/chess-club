const HEADER_OFFSET_PX = 64;

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET_PX;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });
}
