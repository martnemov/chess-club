const AUTO_DELAY_MS = 4000;
const RESIZE_DEBOUNCE_MS = 150;
const GAP_PX = 20;

export function initParticipantsCarousel() {
  const track = document.getElementById('participants-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentEl = document.getElementById('current-slide');
  const totalEl = document.getElementById('total-slides');

  if (!track || !prevBtn || !nextBtn) return;

  const originalCards = Array.from(track.children);
  const totalCards = originalCards.length;

  originalCards.forEach((card) => {
    track.appendChild(card.cloneNode(true));
  });

  const allCards = Array.from(track.children);
  let currentIndex = 0;
  let isTransitioning = false;
  let autoTimer = null;

  totalEl.textContent = totalCards;
  currentEl.textContent = 1;

  function getCardWidth() {
    return allCards[0].offsetWidth;
  }

  function setOffset(index, animated) {
    const offset = index * (getCardWidth() + GAP_PX);
    track.style.transition = animated ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
  }

  function updateCounter() {
    currentEl.textContent = String((currentIndex % totalCards) + 1);
  }

  function nextSlide() {
    if (isTransitioning) return;
    currentIndex++;
    if (currentIndex >= totalCards) {
      currentIndex = 0;
      setOffset(0, false);
      updateCounter();
      return;
    }
    isTransitioning = true;
    setOffset(currentIndex, true);
    updateCounter();
  }

  function prevSlide() {
    if (isTransitioning) return;
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = totalCards - 1;
      setOffset(totalCards - 1, false);
      updateCounter();
      return;
    }
    isTransitioning = true;
    setOffset(currentIndex, true);
    updateCounter();
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
  });

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

  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener('mouseenter', () => btn.classList.add('is-hovered'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('is-hovered'));
  });

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
      setOffset(currentIndex, false);
    }, RESIZE_DEBOUNCE_MS);
  });

  setOffset(0, false);
  startAuto();
}
