/* Focus support for the existing custom lot confirmation only.
   Existing inline handlers own validation, visibility, reset and submission. */
(() => {
    const modal = document.getElementById('modalConfirmacion');
    if (!modal) return;
    let wasOpen = false;
    let opener = null;
    const isOpen = () => getComputedStyle(modal).display !== 'none';
    const controls = () => [...modal.querySelectorAll('button, a[href], input, select, [tabindex="0"]')]
        .filter(el => !el.disabled && el.getClientRects().length);
    new MutationObserver(() => {
        const open = isOpen();
        if (open === wasOpen) return;
        wasOpen = open;
        if (open) {
            opener = document.activeElement;
            // Return is the initial focus; Enter cannot accidentally confirm stock.
            modal.querySelector('.btn-modal-no')?.focus();
        } else if (modal.contains(document.activeElement) && opener?.isConnected) {
            // Keep explicit scanner/reset focus changes made by original handlers.
            opener.focus();
        }
    }).observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });
    modal.addEventListener('keydown', event => {
        if (!isOpen()) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            modal.querySelector('.btn-modal-no')?.click();
        }
        if (event.key !== 'Tab') return;
        const items = controls();
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first?.focus();
        }
    });
})();
