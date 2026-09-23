/*
 * Image carousel with side arrows, dot navigation, keyboard and swipe support.
 */

const SWIPE_THRESHOLD = 50;

export default class Carousel {
    constructor(root) {
        this.root = root;
        this.track = root.querySelector('.carousel__track');
        this.slides = Array.from(root.querySelectorAll('.carousel__slide'));
        this.dotsContainer = root.querySelector('.carousel__dots');
        this.currentIndex = 0;

        this.dots = this.slides.map((slide, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel__dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
            return dot;
        });

        root.querySelector('.carousel__arrow--prev').addEventListener('click', () => this.prev());
        root.querySelector('.carousel__arrow--next').addEventListener('click', () => this.next());
        root.addEventListener('keydown', (event) => this.handleKeydown(event));
        this.bindSwipe();

        this.goTo(0);
    }

    goTo(index) {
        const count = this.slides.length;
        // Wrap around in both directions.
        this.currentIndex = (index + count) % count;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.slides.forEach((slide, i) => {
            const isActive = i === this.currentIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
        });

        this.dots.forEach((dot, i) => {
            const isActive = i === this.currentIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', String(isActive));
        });
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    handleKeydown(event) {
        if (event.key === 'ArrowRight') {
            this.next();
        } else if (event.key === 'ArrowLeft') {
            this.prev();
        }
    }

    bindSwipe() {
        let startX = null;

        this.root.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
        }, { passive: true });

        this.root.addEventListener('touchend', (event) => {
            if (startX === null) {
                return;
            }
            const deltaX = event.changedTouches[0].clientX - startX;
            if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
                if (deltaX < 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            startX = null;
        });
    }
}
