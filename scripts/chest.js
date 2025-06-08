import { gameState } from './game_state.js';
import { addItem } from './inventory.js';
import { updateInventoryUI } from './inventory_state.js';
import { getItemData, loadItems } from './item_loader.js';
import { increaseMaxHp } from './player.js';

const chestContents = {
  'map02:5,5': { item: 'silver_key' },
  'map02:8,12': { message: 'This chest was empty.' },
  'map02:15,15': { item: 'potion_of_health' },
};

export function isChestOpened(id) {
  return gameState.openedChests.has(id);
}

export async function openChest(id, player) {
  if (isChestOpened(id)) return null;
  gameState.openedChests.add(id);
  await loadItems();
  const config = chestContents[id] || {};
  let item = null;
  if (config.item) {
    item = getItemData(config.item);
    if (item) {
      addItem({ ...item, id: config.item });
      if (config.item === 'potion_of_health' && player) {
        increaseMaxHp(1);
        gameState.maxHpBonus = (gameState.maxHpBonus || 0) + 1;
      }
      updateInventoryUI();
    }
  }
  return { item, message: config.message || null };
}
