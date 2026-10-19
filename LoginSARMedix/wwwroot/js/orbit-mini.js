/* Presentation only: one decorative node, no business handlers or network calls. */
(() => {
    'use strict';
    const template = document.getElementById('sm-mini-template');
    if (!template || !window.ResizeObserver) return;
    const host = document.querySelector(template.dataset.miniTarget);
    if (!host) return;
    const placement = template.dataset.miniPlacement;
    const mini = template.content.firstElementChild.cloneNode(true);
    const padding = getComputedStyle(host).paddingRight;
    host.style.setProperty('--sm-mini-original-padding', padding);
    mini.hidden = true;
    host.append(mini);
    let previousWidth = -1;
    let previousWide;
    const update = () => {
        const wide = window.matchMedia('(min-width: 1100px)').matches;
        const width = host.getBoundingClientRect().width;
        // Removing reserved space can change height: do not oscillate on that resize.
        if (width === previousWidth && wide === previousWide) return;
        previousWidth = width;
        previousWide = wide;
        const fits = placement === 'heading' ? width >= 620 : true;
        const visible = wide && fits;
        mini.hidden = !visible;
        host.classList.toggle('sm-mini-host', visible && placement === 'heading');
        host.classList.toggle('sm-mini-slot', visible && placement === 'slot');
        host.classList.toggle('sm-mini-below', visible && placement === 'below');
        if (visible && placement === 'heading') {
            const art = mini.getBoundingClientRect();
            const crowded = [...host.querySelectorAll('h1,h2,button,a,input,select')].some(node => {
                const rect = node.getBoundingClientRect();
                return rect.right > art.left && rect.left < art.right && rect.bottom > art.top && rect.top < art.bottom;
            });
            if (crowded) {
                mini.hidden = true;
                host.classList.remove('sm-mini-host');
            }
        }
    };
    new ResizeObserver(update).observe(host);
    window.matchMedia('(min-width: 1100px)').addEventListener('change', update);
    update();
    document.fonts?.ready.then(() => { previousWidth = -1; update(); });
})();
