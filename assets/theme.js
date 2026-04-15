document.documentElement.classList.remove('no-js');

document.addEventListener('click', function (event) {
  const toggle = event.target.closest('[data-mobile-menu-toggle]');
  if (toggle) {
    const header = document.querySelector('.site-header');
    const isOpen = header?.classList.toggle('is-open') || false;
    toggle.setAttribute('aria-expanded', String(isOpen));
  }

  const qtyButton = event.target.closest('[data-qty-button]');
  if (qtyButton) {
    const action = qtyButton.dataset.qtyButton;
    const input = qtyButton.parentElement?.querySelector('input[type="number"]');
    if (!input) return;
    const current = parseInt(input.value || '1', 10);
    if (action === 'plus') input.value = current + 1;
    if (action === 'minus') input.value = Math.max(1, current - 1);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
