export const inventory = [];

export function addItem(item) {
  inventory.push(item);
}

export function hasItem(nameOrId) {
  return inventory.some(
    it => it.name === nameOrId || it.id === nameOrId
  );
}

export function removeItem(nameOrId) {
  const idx = inventory.findIndex(
    it => it.name === nameOrId || it.id === nameOrId
  );
  if (idx !== -1) {
    inventory.splice(idx, 1);
    return true;
  }
  return false;
}
