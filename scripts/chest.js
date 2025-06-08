import { gameState } from './game_state.js';
import { addItem } from './inventory.js';
import { updateInventoryUI } from './inventory_state.js';
import { getItemData, loadItems } from './item_loader.js';

export function isChestOpened(id) {
  return gameState.openedChests.has(id);
}

export async function openChest(id) {
  if (isChestOpened(id)) return null;
  gameState.openedChests.add(id);
  await loadItems();
  const item = getItemData('rusted_key');
  if (item) {
    addItem(item);
    updateInventoryUI();
  }
  return item;
}
