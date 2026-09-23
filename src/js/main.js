import initNavbar from './navbar';
import initSmoothScroll from './smoothScroll';
import Carousel from './carousel';
import initModals from './modal';
import initReveal from './reveal';

// Lets the CSS know JavaScript is available (used by the scroll-reveal animation).
document.documentElement.classList.add('js');

initNavbar();
initSmoothScroll();
initModals();
initReveal();

document.querySelectorAll('.carousel').forEach((root) => new Carousel(root));
