import { loadJson } from './data_service.js';
import { showError } from './error_prompt.js';
import { itemData } from './item_data.js';

let items = {};

export async function loadItems() {
  if (Object.keys(items).length) return items;
  try {
    const data = await loadJson('../data/items.json');
    items = { ...data, ...itemData };
  } catch (err) {
    items = { ...itemData };
    showError(err.message || 'Failed to load items');
  }
  return items;
}

export function getItemData(id) {
  return items[id];
}
