import { getItemData } from './item_loader.js';
import { player, applyItemReward } from './player.js';
import { gameState } from './game_state.js';
import { getItemBonuses } from './item_stats.js';
import { unlockBlueprint } from './craft_state.js';
import { discover } from './player_memory.js';
import { isRelic } from './relic_state.js';

export const DEFAULT_STACK_LIMIT = 99;
export const inventory = [];
export const passiveModifiers = {};

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
    if (baseId === 'health_amulet') {
      if (!player.bonusHpGiven?.health_amulet) {
        gameState.maxHpBonus = (gameState.maxHpBonus || 0) + 2;
      }
      applyItemReward(baseId);
    }
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
    unlockBlueprint(item.id.replace('blueprint_', ''));
  }
  discover('items', parseItemId(item.id).baseId);
  if (baseId === 'health_amulet') {
    if (!player.bonusHpGiven?.health_amulet) {
      gameState.maxHpBonus = (gameState.maxHpBonus || 0) + 2;
    }
    applyItemReward(baseId);
  }
  document.dispatchEvent(new CustomEvent('inventoryUpdated'));
  return true;
}

export function addItemToInventory(item) {
  return addItem(item);
}

export function giveItem(id, quantity = 1) {
  const data = getItemData(id);
  if (!data) return false;
  return addItem({ ...data, id, quantity });
}

export function hasItem(nameOrId) {
  return getItemCount(nameOrId) > 0;
}

export function useForkedKey() {
  if (hasItem('forked_key')) {
    removeItem('forked_key');
    return true;
  }
  return false;
}

export function useKey(id) {
  if (hasItem(id)) {
    removeItem(id);
    return true;
  }
  return false;
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
  return removeItem(id, qty);
}

export function getItemsByType(type) {
  return inventory.filter((it) => {
    const data = getItemData(it.id);
    return data && data.type === type;
  });
}

export function removeHealthBonusItem() {
  const idx = inventory.findIndex((it) => it.id === 'health_potion');
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
  recalcPassiveModifiers();
  document.dispatchEvent(new CustomEvent('equipmentChanged'));
  return true;
}

export function getEquippedItem(slot) {
  return player.equipment ? player.equipment[slot] : null;
}
