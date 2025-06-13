import { showItemTooltip, hideItemTooltip } from './utils.js';

export function highlightTargets(list = [], onClick) {
  const targets = Array.isArray(list) ? list : [list];
  targets.forEach((info) => {
    const el = info.element || info;
    if (!el) return;
    el.classList.add('target-highlight');
    if (onClick) {
      el.classList.add('clickable-target');
      el.addEventListener('click', () => onClick(info.entity || info), { once: true });
    }
    if (info.tooltip) {
      const show = () => {
        showItemTooltip(el, info.tooltip);
      };
      const hide = () => hideItemTooltip();
      el.addEventListener('mouseenter', show);
      el.addEventListener('mouseleave', hide);
      el.addEventListener('touchstart', show, { once: true });
    }
  });
}

export function clearTargetHighlights(root = document) {
  const els = root.querySelectorAll('.target-highlight');
  els.forEach((el) => {
    el.classList.remove('target-highlight', 'clickable-target');
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
  });
}

export function flashElement(el, type = 'hit') {
  if (!el) return;
  const cls = type === 'heal' ? 'flash-heal' : 'flash-hit';
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 400);
}

export function floatTextOver(el, text, opts = {}) {
  if (!el || !text) return;
  const div = document.createElement('div');
  div.className = 'floating-text';
  if (opts.color) div.style.color = opts.color;
  div.textContent = text;
  document.body.appendChild(div);
  const rect = el.getBoundingClientRect();
  div.style.left = window.scrollX + rect.left + rect.width / 2 + 'px';
  div.style.top = window.scrollY + rect.top - 10 + 'px';
  setTimeout(() => div.remove(), 1200);
}
