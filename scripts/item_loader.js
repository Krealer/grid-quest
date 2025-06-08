let items = {};

export async function loadItems() {
  if (Object.keys(items).length) return items;
  try {
    const res = await fetch('data/items.json');
    if (res.ok) {
      items = await res.json();
    }
  } catch {
    // ignore errors
  }
  return items;
}

export function getItemData(id) {
  return items[id];
}
