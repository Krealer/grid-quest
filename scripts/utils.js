export function getUpgradeLevel(id) {
  const match = /^.+\+(\d+)$/.exec(id);
  return match ? parseInt(match[1], 10) : 0;
}

export function splitItemId(id) {
  const [main, enchant] = id.split('#');
  let baseId = main;
  let level = 0;
  const match = /^(.+)\+(\d+)$/.exec(main);
  if (match) {
    baseId = match[1];
    level = parseInt(match[2], 10);
  }
  return { baseId, level, enchant: enchant || null };
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
