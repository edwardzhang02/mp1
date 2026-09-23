/*
 * Accessible modal windows. Buttons with [data-modal-open="id"] open the matching modal;
 * the close button, the backdrop and the Escape key close it.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

let activeModal = null;
let lastTrigger = null;

const closeModal = () => {
    if (!activeModal) {
        return;
    }
    activeModal.classList.remove('is-open');
    activeModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    activeModal = null;

    if (lastTrigger) {
        // preventScroll keeps focus return from interrupting smooth scrolling.
        lastTrigger.focus({ preventScroll: true });
    }
};

const openModal = (modal, trigger) => {
    closeModal();
    activeModal = modal;
    lastTrigger = trigger;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('[data-modal-close]').focus();
};

// Keep keyboard focus inside the open modal.
const trapFocus = (event) => {
    const focusable = Array.from(activeModal.querySelectorAll(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
};

export default function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
        const modal = document.getElementById(trigger.dataset.modalOpen);
        trigger.addEventListener('click', () => openModal(modal, trigger));
    });

    document.querySelectorAll('.modal').forEach((modal) => {
        modal.querySelector('[data-modal-close]').addEventListener('click', closeModal);
        // In-page links inside a modal close it before scrolling to their section.
        modal.querySelectorAll('a[data-scroll]').forEach((link) => link.addEventListener('click', closeModal));
        modal.addEventListener('click', (event) => {
            // Clicking the dark backdrop (outside the dialog) closes the modal.
            if (event.target === modal) {
                closeModal();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (!activeModal) {
            return;
        }
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'Tab') {
            trapFocus(event);
        }
    });
}
