import { loadJson } from './data_service.js';
import { itemData } from './item_data.js';

let items = {};

export async function loadItems() {
  if (Object.keys(items).length) return items;
  try {
    const data = await loadJson('data/items.json');
    items = { ...data, ...itemData };
  } catch (err) {
    items = { ...itemData };
  }
  return items;
}

export function getItemData(id) {
  return items[id];
}
