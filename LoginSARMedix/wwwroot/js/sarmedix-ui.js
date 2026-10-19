/* Presentation only: never submits, fetches, changes focus or handles business events. */
(() => {
    'use strict';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const button = document.querySelector('.sm-motion-toggle');
    if (button) {
        button.addEventListener('click', () => {
            const paused = document.body.classList.toggle('sm-motion-paused');
            button.setAttribute('aria-pressed', String(paused));
            button.textContent = paused ? 'Reanudar efectos' : 'Pausar efectos';
            button.setAttribute('aria-label', paused ? 'Reanudar efectos ambientales' : 'Pausar efectos ambientales');
        });
    }
    document.querySelectorAll('.pagina-modulos .modulo').forEach(card => {
        let frame = 0;
        card.addEventListener('pointermove', event => {
            if (reduced.matches || !finePointer.matches || document.body.classList.contains('sm-motion-paused')) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const box = card.getBoundingClientRect();
                card.style.setProperty('--sm-pointer-x', `${event.clientX - box.left}px`);
                card.style.setProperty('--sm-pointer-y', `${event.clientY - box.top}px`);
            });
        });
        card.addEventListener('pointerleave', () => {
            cancelAnimationFrame(frame);
            card.style.removeProperty('--sm-pointer-x');
            card.style.removeProperty('--sm-pointer-y');
        });
    });
})();
