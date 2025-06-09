import { getItemData } from './item_loader.js';
import { player } from './player.js';
import { getItemBonuses } from './item_stats.js';
import { unlockBlueprint } from './craft_state.js';
import { discover } from './player_memory.js';

export const inventory = [];

export function parseItemId(id) {
  const match = /^(.+)\+(\d+)$/.exec(id);
  if (match) {
    return { baseId: match[1], level: parseInt(match[2], 10) };
  }
  return { baseId: id, level: 0 };
}

export function getItemLevel(id) {
  return parseItemId(id).level;
}

export function getItemDisplayName(id) {
  const { baseId, level } = parseItemId(id);
  const data = getItemData(baseId);
  const baseName = data?.name || baseId;
  return level > 0 ? `${baseName} +${level}` : baseName;
}

export function getItemCount(nameOrId) {
  const item = inventory.find(
    it => it.name === nameOrId || it.id === nameOrId
  );
  return item ? item.quantity || 0 : 0;
}

export function addItem(item) {
  const qty = item.quantity || 1;
  const existing = inventory.find(it => it.id === item.id);
  if (existing) {
    if ((existing.quantity || 0) >= 99) return false;
    existing.quantity = Math.min(99, (existing.quantity || 0) + qty);
    discover('items', parseItemId(item.id).baseId);
    document.dispatchEvent(new CustomEvent('inventoryUpdated'));
    return true;
  }
  const name = item.name || getItemDisplayName(item.id);
  const desc = item.description || getItemData(parseItemId(item.id).baseId)?.description || '';
  inventory.push({ ...item, name, description: desc, quantity: qty });
  if (item.id && item.id.startsWith('blueprint_')) {
    unlockBlueprint(item.id.replace('blueprint_', ''));
  }
  discover('items', parseItemId(item.id).baseId);
  document.dispatchEvent(new CustomEvent('inventoryUpdated'));
  return true;
}

export function addItemToInventory(item) {
  return addItem(item);
}

export function hasItem(nameOrId) {
  return getItemCount(nameOrId) > 0;
}

export function removeItem(nameOrId, qty = 1) {
  const item = inventory.find(
    it => it.name === nameOrId || it.id === nameOrId
  );
  if (item) {
    item.quantity = (item.quantity || 0) - qty;
    if (item.quantity <= 0) {
      const idx = inventory.indexOf(item);
      if (idx !== -1) inventory.splice(idx, 1);
    }
    document.dispatchEvent(new CustomEvent('inventoryUpdated'));
    return true;
  }
  return false;
}

export function getItemsByType(type) {
  return inventory.filter(it => {
    const data = getItemData(it.id);
    return data && data.type === type;
  });
}

export function removeHealthBonusItem() {
  const idx = inventory.findIndex(it => it.id === 'potion_of_health');
  if (idx !== -1) {
    inventory.splice(idx, 1);
    document.dispatchEvent(new CustomEvent('inventoryUpdated'));
    return true;
  }
  return false;
}

export function equipItem(itemId) {
  const bonus = getItemBonuses(itemId);
  if (!bonus || !bonus.slot) return false;
  if (!player.equipment) {
    player.equipment = { weapon: null, armor: null, accessory: null };
  }
  player.equipment[bonus.slot] = itemId;
  document.dispatchEvent(new CustomEvent('equipmentChanged'));
  return true;
}

export function getEquippedItem(slot) {
  return player.equipment ? player.equipment[slot] : null;
}

