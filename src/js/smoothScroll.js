/*
 * Smooth scrolling for in-page links marked with [data-scroll].
 * Uses requestAnimationFrame with an easing curve so the motion is consistent across browsers.
 */

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

let animationId = null;

const cancelScroll = () => {
    if (animationId !== null) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
    }
};

// Height of the compact navbar, read from the CSS custom property set in SCSS.
const getNavOffset = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    const heightRem = parseFloat(rootStyles.getPropertyValue('--nav-height-small'));
    return heightRem * parseFloat(rootStyles.fontSize);
};

const scrollToY = (targetY) => {
    cancelScroll();

    const startY = window.scrollY;
    const distance = targetY - startY;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || Math.abs(distance) < 1) {
        window.scrollTo(0, targetY);
        return;
    }

    const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 0.4));
    let startTime = null;

    const step = (timestamp) => {
        if (startTime === null) {
            startTime = timestamp;
        }
        const progress = Math.min((timestamp - startTime) / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));

        animationId = progress < 1 ? window.requestAnimationFrame(step) : null;
    };

    animationId = window.requestAnimationFrame(step);
};

export default function initSmoothScroll() {
    document.querySelectorAll('a[data-scroll]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) {
                return;
            }
            event.preventDefault();

            const maxY = document.documentElement.scrollHeight - window.innerHeight;
            const isFirstSection = target.id === 'home';
            const targetTop = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
            const targetY = isFirstSection ? 0 : Math.min(Math.max(targetTop, 0), maxY);

            scrollToY(targetY);
            window.history.replaceState(null, '', link.getAttribute('href'));
        });
    });

    // Let the user take over if they scroll manually mid-animation.
    window.addEventListener('wheel', cancelScroll, { passive: true });
    window.addEventListener('touchstart', cancelScroll, { passive: true });
}
