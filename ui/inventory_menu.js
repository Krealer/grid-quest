import { updateInventoryUI } from '../scripts/inventory_ui.js';
import { loadItems } from '../scripts/item_loader.js';

/**
 * Refresh the inventory display after the internal state has changed or been
 * loaded from a save. Re-renders the item list so quantities, equipped
 * highlights and action handlers are accurate.
 */
export async function refreshInventoryDisplay() {
  await loadItems();
  updateInventoryUI();
}

export function initInventoryMenu() {
  const categories = document.querySelector('.inventory-categories');
  function updateTabs() {
    if (!categories) return;
    if (window.innerWidth < 480) {
      categories.classList.add('mobile');
    } else {
      categories.classList.remove('mobile');
    }
  }
  updateTabs();
  window.addEventListener('resize', updateTabs);
}
