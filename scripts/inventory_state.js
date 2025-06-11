import { inventory } from './inventory.js';
import { player, reapplyEquipmentBonuses } from './player.js';

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
  }
};
