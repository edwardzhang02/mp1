/*
 * Sticky navbar: shrinks after scrolling, highlights the section currently
 * under the navbar (position indicator) and handles the mobile menu toggle.
 */

const SHRINK_OFFSET = 50;

export default function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menu = document.getElementById('nav-menu');
    const toggle = document.getElementById('nav-toggle');
    const links = Array.from(menu.querySelectorAll('.navbar__link'));
    const sections = links.map((link) => document.querySelector(link.getAttribute('href')));

    const setActiveLink = (index) => {
        links.forEach((link, i) => {
            const isActive = i === index;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const getActiveIndex = () => {
        const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (scrolledToBottom) {
            return sections.length - 1;
        }

        // The active section is the last one whose top edge has passed the navbar's bottom edge.
        const navBottom = navbar.getBoundingClientRect().bottom;
        let activeIndex = 0;
        sections.forEach((section, i) => {
            if (section.getBoundingClientRect().top <= navBottom + 1) {
                activeIndex = i;
            }
        });
        return activeIndex;
    };

    const update = () => {
        navbar.classList.toggle('is-shrunk', window.scrollY > SHRINK_OFFSET);
        setActiveLink(getActiveIndex());
    };

    // Throttle scroll/resize work to one update per animation frame.
    let ticking = false;
    const requestUpdate = () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            });
        }
    };

    const closeMenu = () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.forEach((link) => link.addEventListener('click', closeMenu));

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    // The navbar height animates, so re-check once the transition finishes.
    navbar.addEventListener('transitionend', requestUpdate);

    update();
}
