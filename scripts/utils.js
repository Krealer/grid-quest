export function getUpgradeLevel(id) {
  const match = /^.+\+(\d+)$/.exec(id);
  return match ? parseInt(match[1], 10) : 0;
}

let tooltipEl;

export function showItemTooltip(target, text) {
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

export function hideItemTooltip() {
  if (tooltipEl) {
    tooltipEl.style.display = 'none';
  }
}
