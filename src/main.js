import './styles/main.css';
import { initTicker } from './scripts/ticker.js';
import { initHamburger } from './scripts/hamburger.js';
import { initParticipantsCarousel } from './scripts/carousel.js';
import { initStagesCarousel } from './scripts/stages-carousel.js';
import { initSmoothScroll } from './scripts/smooth-scroll.js';
import { initScrollReveal } from './scripts/scroll-reveal.js';

initTicker('ticker-top');
initTicker('ticker-bottom');
initHamburger();
initParticipantsCarousel();
initStagesCarousel();
initSmoothScroll();
initScrollReveal();
