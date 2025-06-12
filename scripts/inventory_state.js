import {
  inventory,
  addItem as invAddItem,
  removeItem as invRemoveItem
} from './inventory.js';
import { player, reapplyEquipmentBonuses } from './player.js';
import { getUnlockedBlueprints } from './craft_state.js';
import { loadRecipes } from './craft.js';

export function serializeInventory() {
  return {
    items: inventory.map((it) => ({ id: it.id, quantity: it.quantity })),
    equipment: { ...player.equipment }
  };
}

export function deserializeInventory(data) {
  if (!data) return;
  if (Array.isArray(data.items)) {
    inventory.length = 0;
    data.items.forEach((it) => {
      if (it && it.id) {
        inventory.push({ id: it.id, quantity: it.quantity || 1 });
      }
    });
  }
  if (data.equipment) {
    player.equipment.weapon = data.equipment.weapon || null;
    player.equipment.armor = data.equipment.armor || null;
    player.equipment.accessory = data.equipment.accessory || null;
  }
}

export function loadInventoryFromObject(savedInventory) {
  deserializeInventory(savedInventory);
  reapplyEquipmentBonuses();
  document.dispatchEvent(new CustomEvent('inventoryUpdated'));
}

export const inventoryState = {
  loadFromObject(savedInventory) {
    deserializeInventory(savedInventory);
    reapplyEquipmentBonuses();
    document.dispatchEvent(new CustomEvent('inventoryUpdated'));
  },
  addItem(item) {
    return invAddItem(item);
  },
  removeItem(id, qty = 1) {
    return invRemoveItem(id, qty);
  },
  addItems(map) {
    if (!map) return false;
    let changed = false;
    Object.entries(map).forEach(([id, qty]) => {
      if (invAddItem({ id, quantity: qty })) changed = true;
    });
    return changed;
  },
  removeItems(map) {
    if (!map) return false;
    let changed = false;
    Object.entries(map).forEach(([id, qty]) => {
      if (invRemoveItem(id, qty)) changed = true;
    });
    return changed;
  }
};

export async function getBlueprints() {
  const recipeData = await loadRecipes();
  const ids = getUnlockedBlueprints();
  return ids
    .map((bid) => Object.values(recipeData).find((r) => r.blueprintId === bid))
    .filter(Boolean);
}
