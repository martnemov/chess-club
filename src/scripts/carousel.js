const AUTO_DELAY_MS = 4000;
const RESIZE_DEBOUNCE_MS = 150;
const GAP_PX = 16;

export function initParticipantsCarousel() {
  const track = document.getElementById('participants-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentEl = document.getElementById('current-slide');
  const totalEl = document.getElementById('total-slides');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoTimer = null;

  totalEl.textContent = totalCards;

  function getVisibleCount() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, totalCards - getVisibleCount());
  }

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const offset = currentIndex * (cardWidth + GAP_PX);
    track.style.transform = `translateX(-${offset}px)`;
    currentEl.textContent = currentIndex + 1;
  }

  function nextSlide() {
    const max = getMaxIndex();
    currentIndex = currentIndex >= max ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function prevSlide() {
    const max = getMaxIndex();
    currentIndex = currentIndex <= 0 ? max : currentIndex - 1;
    updateCarousel();
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, AUTO_DELAY_MS);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    startAuto();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    startAuto();
  });

  const viewport = track.parentElement;
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      currentIndex = Math.min(currentIndex, getMaxIndex());
      updateCarousel();
    }, RESIZE_DEBOUNCE_MS);
  });

  updateCarousel();
  startAuto();
}
