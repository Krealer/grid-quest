import { loadItems } from './item_loader.js';

let itemInfoList = [];
let loaded = false;

export async function loadItemInfo() {
  if (loaded) return itemInfoList;
  const items = await loadItems();
  itemInfoList = Object.keys(items).map(id => ({
    id,
    name: items[id].name,
    description: items[id].description || ''
  }));
  loaded = true;
  return itemInfoList;
}

export function getAllItems() {
  return itemInfoList;
}
