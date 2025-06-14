let tooltipEl;

export function showTooltip(target, text) {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'item-tooltip';
    document.body.appendChild(tooltipEl);
  }
  tooltipEl.textContent = text;
  const rect = target.getBoundingClientRect();
  tooltipEl.style.top = window.scrollY + rect.bottom + 4 + 'px';
  tooltipEl.style.left = window.scrollX + rect.left + 'px';
  tooltipEl.style.display = 'block';
}

export function hideTooltip() {
  if (tooltipEl) tooltipEl.style.display = 'none';
}

export function attachTooltip(el, content) {
  if (!el) return;
  const getText = typeof content === 'function' ? content : () => content;
  const show = () => showTooltip(el, getText());
  const hide = hideTooltip;
  el.addEventListener('mouseenter', show);
  el.addEventListener('mouseleave', hide);
  el.addEventListener(
    'touchstart',
    (e) => {
      e.stopPropagation();
      show();
      const close = () => {
        hide();
        document.removeEventListener('touchstart', close);
      };
      document.addEventListener('touchstart', close);
    },
    { once: true }
  );
}
