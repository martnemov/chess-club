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

  // Prepend clone of card 1 at index 0 — used for backward wrap animation (6→1)
  track.insertBefore(originalCards[0].cloneNode(true), track.firstChild);

  // Append clones of all cards — fill visible slots at right boundary
  originalCards.forEach((card) => {
    track.appendChild(card.cloneNode(true));
  });

  // Index layout: 0=clone(card1)  1..totalCards=originals  totalCards+1..=appended clones
  let currentIndex = 1;
  let isTransitioning = false;
  let autoTimer = null;

  totalEl.textContent = String(totalCards);
  currentEl.textContent = '1';

  function getCardWidth() {
    return track.children[0].offsetWidth;
  }

  function setOffset(index, animated) {
    const offset = index * (getCardWidth() + GAP_PX);
    track.style.transition = animated ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
  }

  function updateCounter() {
    currentEl.textContent = String(currentIndex === 0 ? 1 : currentIndex);
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentIndex === totalCards) {
      // Last card: slide backward (right) to prepended clone of card 1
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    setOffset(currentIndex, true);
    updateCounter();
  }

  function prevSlide() {
    if (isTransitioning) return;

    if (currentIndex <= 1) {
      // First card: instant jump to last card
      currentIndex = totalCards;
      setOffset(currentIndex, false);
      updateCounter();
      return;
    }
    isTransitioning = true;
    currentIndex--;
    setOffset(currentIndex, true);
    updateCounter();
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target !== track || e.propertyName !== 'transform') return;
    if (currentIndex === 0) {
      // After backward loop animation: snap invisibly to real card 1
      currentIndex = 1;
      setOffset(1, false);
      // rAF ensures transition:none is committed before re-enabling clicks
      requestAnimationFrame(() => {
        isTransitioning = false;
      });
    } else {
      isTransitioning = false;
    }
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

  setOffset(1, false);
  startAuto();
}
