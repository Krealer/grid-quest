import { loadJson } from './dataService.js';

let items = {};

export async function loadItems() {
  if (Object.keys(items).length) return items;
  const data = await loadJson('data/items.json');
  if (data) {
    items = data;
  }
  return items;
}

export function getItemData(id) {
  return items[id];
}
