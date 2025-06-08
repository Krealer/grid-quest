export const inventory = [];

export function addItem(item) {
  inventory.push(item);
}

export function hasItem(name) {
  return inventory.some(it => it.name === name);
}

export function removeItem(name) {
  const idx = inventory.findIndex(it => it.name === name);
  if (idx !== -1) {
    inventory.splice(idx, 1);
    return true;
  }
  return false;
}
