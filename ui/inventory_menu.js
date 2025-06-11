import { updateInventoryUI } from '../scripts/inventory_ui.js';

/**
 * Refresh the inventory display after the internal state has changed or been
 * loaded from a save. Re-renders the item list so quantities, equipped
 * highlights and action handlers are accurate.
 */
export function refreshInventoryDisplay() {
  updateInventoryUI();
}
