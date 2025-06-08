export const inventory = [];

export function addItem(item) {
  inventory.push(item);
}

export function hasItem(name) {
  return inventory.some(it => it.name === name);
}
