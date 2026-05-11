const AUTO_DELAY_MS = 4000;
const RESIZE_DEBOUNCE_MS = 150;

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

  function getGap() {
    return parseFloat(getComputedStyle(track).gap) || 0;
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

  let transitionSafetyTimer = null;

  function onTransitionDone() {
    clearTimeout(transitionSafetyTimer);
    if (currentIndex === 0) {
      currentIndex = 1;
      setOffset(1, false);
      requestAnimationFrame(() => {
        isTransitioning = false;
      });
    } else {
      isTransitioning = false;
    }
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target !== track || e.propertyName !== 'transform') return;
    onTransitionDone();
  });

  function setOffset(index, animated) {
    clearTimeout(transitionSafetyTimer);
    const offset = index * (getCardWidth() + getGap());
    track.style.transition = animated ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    if (animated) {
      // Fallback: unlock isTransitioning if transitionend never fires (iOS quirk)
      transitionSafetyTimer = setTimeout(onTransitionDone, 600);
    }
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

  // Pause autoplay on hover (desktop only — iOS mouseenter fires on tap and never fires mouseleave)
  const viewport = track.parentElement;
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
  viewport.addEventListener('mouseenter', () => { if (!isTouchDevice()) stopAuto(); });
  viewport.addEventListener('mouseleave', () => { if (!isTouchDevice()) startAuto(); });

  // Touch swipe support
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) { nextSlide(); } else { prevSlide(); }
      startAuto();
    }
  }, { passive: true });

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
