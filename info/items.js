export const usedItems = [];

export function markItemUsed(id) {
  if (!usedItems.includes(id)) usedItems.push(id);
}
