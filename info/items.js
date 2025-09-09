const USED_ITEMS_KEY = 'gridquest.usedItems';

export function markItemUsed(id) {
  try {
    const used = JSON.parse(localStorage.getItem(USED_ITEMS_KEY)) || [];
    if (!used.includes(id)) {
      used.push(id);
      localStorage.setItem(USED_ITEMS_KEY, JSON.stringify(used));
    }
  } catch {
    // Ignore storage errors (e.g., in environments without localStorage)
  }
}

export function getUsedItems() {
  try {
    return JSON.parse(localStorage.getItem(USED_ITEMS_KEY)) || [];
  } catch {
    return [];
  }
}
