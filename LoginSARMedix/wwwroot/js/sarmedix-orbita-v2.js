/* Órbita 02: additive presentation. Does not replace existing handlers,
   intercept clicks/submits, navigate, move focus, fetch, or access storage. */
(() => {
    'use strict';
    const body = document.body;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const controls = document.querySelectorAll('[data-sm-motion-control]');
    const cards = document.querySelectorAll('.pagina-modulos .modulo');
    const resetters = [];
    const allowed = () => !reduced.matches && fine.matches && !body.classList.contains('sm-motion-paused');

    function syncMotion() {
        const paused = body.classList.contains('sm-motion-paused');
        controls.forEach(control => {
            control.hidden = reduced.matches;
            control.setAttribute('aria-pressed', String(paused));
            control.setAttribute('aria-label', paused ? 'Reanudar efectos visuales' : 'Pausar efectos visuales');
            control.querySelector('[data-sm-motion-label]').textContent = paused ? 'Reanudar efectos' : 'Pausar efectos';
        });
        // Keep the original welcome switch in sync without changing its handler.
        const original = document.querySelector('.sm-motion-toggle');
        if (original) {
            original.setAttribute('aria-pressed', String(paused));
            original.textContent = paused ? 'Reanudar efectos' : 'Pausar efectos';
            original.setAttribute('aria-label', paused ? 'Reanudar efectos ambientales' : 'Pausar efectos ambientales');
        }
        if (!allowed()) resetters.forEach(reset => reset());
    }
    controls.forEach(control => control.addEventListener('click', () => body.classList.toggle('sm-motion-paused')));
    cards.forEach(card => {
        let frame = 0;
        const reset = () => {
            cancelAnimationFrame(frame);
            card.style.removeProperty('--sm-tilt-x');
            card.style.removeProperty('--sm-tilt-y');
        };
        resetters.push(reset);
        card.addEventListener('pointermove', event => {
            if (!allowed()) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                if (!allowed()) return;
                const rect = card.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
                const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
                card.style.setProperty('--sm-tilt-x', `${-y * 3}deg`);
                card.style.setProperty('--sm-tilt-y', `${x * 3}deg`);
            });
        });
        card.addEventListener('pointerleave', reset);
        card.addEventListener('pointercancel', reset);
    });
    new MutationObserver(syncMotion).observe(body, {attributes: true, attributeFilter: ['class']});
    reduced.addEventListener('change', syncMotion);
    fine.addEventListener('change', syncMotion);
    syncMotion();
})();
