const MOBILE_BREAKPOINT = 768;

export function initStagesCarousel() {
  const track = document.getElementById('stages-track');
  const prevBtn = document.getElementById('stages-prev');
  const nextBtn = document.getElementById('stages-next');
  const dots = Array.from(document.querySelectorAll('.stages__dot'));

  if (!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.stages__slide'));
  const total = slides.length;
  let current = 0;
  let isTransitioning = false;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function getSlideWidth() {
    return track.parentElement.offsetWidth;
  }

  function goTo(index, animated = true) {
    if (!isMobile()) {
      track.style.transform = '';
      return;
    }
    if (isTransitioning && animated) return;
    current = ((index % total) + total) % total;
    if (animated) isTransitioning = true;
    track.style.transition = animated ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('stages__dot--active', i === current);
    });
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target === track && e.propertyName === 'transform') {
      isTransitioning = false;
    }
  });

  // Hover на стрелках
  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener('mouseenter', () => btn.classList.add('is-hovered'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('is-hovered'));
  });

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isMobile()) {
        goTo(current, false);
      } else {
        track.style.transform = '';
        current = 0;
        dots.forEach((dot, i) => dot.classList.toggle('stages__dot--active', i === 0));
      }
    }, 100);
  });

  if (isMobile()) {
    goTo(0, false);
  }
}
