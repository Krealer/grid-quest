import { updateCraftUI } from '../scripts/craft_ui.js';
import { beginCraftingSession, endCraftingSession } from '../scripts/craft.js';

export function toggleCraftMenu() {
  const overlay = document.getElementById('craft-overlay');
  const grid = document.getElementById('game-grid');
  if (!overlay || !grid) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
    grid.classList.remove('blurred', 'no-interact');
    endCraftingSession();
  } else {
    updateCraftUI();
    overlay.scrollTop = 0;
    overlay.classList.add('active');
    grid.classList.add('blurred', 'no-interact');
    beginCraftingSession();
  }
}

export function initCraftMenu() {
  const overlay = document.getElementById('craft-overlay');
  const closeBtn = overlay?.querySelector('.close-btn');
  closeBtn?.addEventListener('click', toggleCraftMenu);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) toggleCraftMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('active')) {
      toggleCraftMenu();
    }
  });
}
