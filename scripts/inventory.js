import { getItemData } from './item_loader.js';
import { player, updatePassiveEffects } from './player.js';
import { gameState } from './game_state.js';
import { getItemBonuses } from './item_stats.js';
import { checkTempleSet } from './equipment.js';
import { unlockBlueprint } from './craft_state.js';
import { discover } from './player_memory.js';
import { isRelic } from './relic_state.js';

export const DEFAULT_STACK_LIMIT = 99;
export const inventory = [];
export const passiveModifiers = {};
export const itemUsage = {};

export function recordItemUse(id, qty = 1) {
  if (!id) return;
  itemUsage[id] = (itemUsage[id] || 0) + qty;
}

export function getItemUsageCount(id) {
  return itemUsage[id] || 0;
}

export function recalcPassiveModifiers() {
  Object.keys(passiveModifiers).forEach((k) => delete passiveModifiers[k]);
  const eq = player.equipment || {};
  Object.values(eq).forEach((id) => {
    if (!id) return;
    const data = getItemData(parseItemId(id).baseId);
    if (data && data.passiveModifier) {
      Object.entries(data.passiveModifier).forEach(([k, v]) => {
        passiveModifiers[k] = (passiveModifiers[k] || 0) + v;
      });
    }
  });
}

export function getPassiveModifiers() {
  return { ...passiveModifiers };
}

recalcPassiveModifiers();

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
    (it) => it.name === nameOrId || it.id === nameOrId
  );
  return item ? item.quantity || 0 : 0;
}

export function addItem(item) {
  const qty = item.quantity || 1;
  if (isRelic(parseItemId(item.id).baseId)) return false;
  const baseId = parseItemId(item.id).baseId;
  const data = getItemData(baseId) || {};
  const limit = data.stackLimit || DEFAULT_STACK_LIMIT;
  const existing = inventory.find((it) => it.id === item.id);
  if (existing) {
    if ((existing.quantity || 0) >= limit) return false;
    existing.quantity = Math.min(limit, (existing.quantity || 0) + qty);
    discover('items', parseItemId(item.id).baseId);
    document.dispatchEvent(new CustomEvent('inventoryUpdated'));
    return true;
  }
  const name = item.name || getItemDisplayName(item.id);
  const desc =
    item.description ||
    getItemData(parseItemId(item.id).baseId)?.description ||
    '';
  inventory.push({
    ...item,
    name,
    description: desc,
    quantity: Math.min(qty, limit)
  });
  if (item.id && item.id.startsWith('blueprint_')) {
    const base = item.id.replace('blueprint_', '');
    unlockBlueprint(`${base}_blueprint`);
  }
  discover('items', parseItemId(item.id).baseId);
  document.dispatchEvent(new CustomEvent('inventoryUpdated'));
  return true;
}

export function addItemToInventory(item) {
  return addItem(item);
}

export async function giveItem(id, quantity = 1) {
  const { loadItems } = await import('./item_loader.js');
  await loadItems();
  const data = getItemData(id);
  if (!data) return false;
  const added = addItem({ ...data, id, quantity });
  document.dispatchEvent(new CustomEvent('inventoryUpdated'));
  return added;
}

export function hasItem(nameOrId) {
  return getItemCount(nameOrId) > 0;
}

export function useForkedKey() {
  if (hasItem('forked_key')) {
    const data = getItemData('forked_key');
    if (data?.consumable !== false) removeItem('forked_key');
    return true;
  }
  return false;
}

export function useKey(id) {
  if (!hasItem(id)) return false;
  const data = getItemData(id);
  if (data?.consumable !== false) removeItem(id);
  return true;
}

export function hasCodeFile() {
  return hasItem('code_file');
}

export function removeItem(nameOrId, qty = 1) {
  if (isRelic(parseItemId(nameOrId).baseId)) return false;
  const item = inventory.find(
    (it) => it.name === nameOrId || it.id === nameOrId
  );
  if (item) {
    const removeQty = Math.min(qty, item.quantity || 0);
    item.quantity = (item.quantity || 0) - removeQty;
    if (item.quantity <= 0) {
      const idx = inventory.indexOf(item);
      if (idx !== -1) inventory.splice(idx, 1);
    }
    document.dispatchEvent(new CustomEvent('inventoryUpdated'));
    return true;
  }
  return false;
}

export function consumeItem(id, qty = 1) {
  const data = getItemData(id);
  if (data?.consumable === false) return false;
  const removed = removeItem(id, qty);
  if (removed) recordItemUse(id, qty);
  return removed;
}

export function getItemsByTag(tag) {
  return inventory.filter((it) => {
    const data = getItemData(it.id);
    return data && Array.isArray(data.tags) && data.tags.includes(tag);
  });
}

export function getItemsByCategory(category) {
  return inventory.filter((it) => {
    const data = getItemData(it.id);
    if (!data) return false;
    const cat = data.category || 'general';
    return cat === category;
  });
}

export function getItemsByType(type) {
  return inventory.filter((it) => {
    const data = getItemData(it.id);
    return (
      (data && data.type === type) ||
      (Array.isArray(data.tags) && data.tags.includes(type))
    );
  });
}

export function removePrismFragments(qty = 10) {
  return removeItem('prism_fragment', qty);
}

export function removeEnemyDropItem() {
  const enemyItems = [
    'prism_fragment',
    'goblin_ear',
    'zombie_claw',
    'cracked_signet',
    'arcane_core',
    'warden_crest',
    'idol_fragment',
    'obsidian_core'
  ];
  for (const id of enemyItems) {
    if (getItemCount(id) > 0) {
      removeItem(id, 1);
      return id;
    }
  }
  return null;
}

export function equipItem(itemId) {
  const data = getItemData(itemId);
  if (data && data.type === 'key') return false;
  const bonus = getItemBonuses(itemId);
  if (!bonus || !bonus.slot) return false;
  if (!player.equipment) {
    player.equipment = { weapon: null, armor: null, accessory: null };
  }
  player.equipment[bonus.slot] = itemId;
  recalcPassiveModifiers();
  checkTempleSet();
  updatePassiveEffects();
  document.dispatchEvent(new CustomEvent('equipmentChanged'));
  return true;
}

export function getEquippedItem(slot) {
  return player.equipment ? player.equipment[slot] : null;
}

export function isEquipped(itemId) {
  const { baseId } = parseItemId(itemId);
  const eq = player.equipment || {};
  return Object.values(eq).some(
    (eqId) => eqId && parseItemId(eqId).baseId === baseId
  );
}
