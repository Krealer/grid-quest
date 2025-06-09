let items = {};

import { showError } from './errorMessage.js';

export async function loadItems() {
  if (Object.keys(items).length) return items;
  try {
    const res = await fetch('data/items.json');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    items = await res.json();
  } catch (err) {
    console.error('Failed to load items', err);
    showError('Failed to load item data. Please try again later.');
  }
  return items;
}

export function getItemData(id) {
  return items[id];
}
