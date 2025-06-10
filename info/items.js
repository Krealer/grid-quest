export const usedItems = [];

export const itemDescriptions = {
  map02_key: 'A simple key needed to unlock the way forward.',
  health_amulet: 'A relic that permanently boosts your vitality by 1.',
  empty_note: 'The note is blank, leaving more questions than answers.',
  focus_ring: 'A ring that sharpens concentration, boosting accuracy by 10%.'
};

export function markItemUsed(id) {
  if (!usedItems.includes(id)) usedItems.push(id);
}
