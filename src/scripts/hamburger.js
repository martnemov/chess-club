const DESKTOP_BREAKPOINT = 1024;
const RESIZE_DEBOUNCE_MS = 100;

export function initHamburger() {
  const hamburger = document.getElementById('hamburger-btn');
  const nav = document.getElementById('primary-nav');
  const body = document.body;

  if (!hamburger || !nav) return;

  function toggleMenu(forceState) {
    const isOpen =
      forceState !== undefined ? forceState : hamburger.getAttribute('aria-expanded') !== 'true';

    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    nav.setAttribute('data-open', String(isOpen));
    body.setAttribute('data-menu-open', String(isOpen));
  }

  hamburger.addEventListener('click', () => toggleMenu());

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= DESKTOP_BREAKPOINT) toggleMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > DESKTOP_BREAKPOINT) toggleMenu(false);
    }, RESIZE_DEBOUNCE_MS);
  });
}
