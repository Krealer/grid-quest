import { loadJson } from './dataService.js';
import { showError } from './errorPrompt.js';
import { itemData } from './item_data.js';

let items = {};

export async function loadItems() {
  if (Object.keys(items).length) return items;
  const data = await loadJson('data/items.json');
  if (data) {
    items = { ...data, ...itemData };
  } else {
    items = { ...itemData };
    showError('Failed to load items');
  }
  return items;
}

export function getItemData(id) {
  return items[id];
}
