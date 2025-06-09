import { getItemData } from './item_loader.js';

export const inventory = [];

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
    document.dispatchEvent(new CustomEvent('inventoryUpdated'));
    return true;
  }
  inventory.push({ ...item, quantity: qty });
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
