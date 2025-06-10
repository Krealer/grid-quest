export const usedItems = [];

export const itemDescriptions = {
  map02_key: 'Unlocks the door from Rainy Crossroads to Twilight Field.',
  health_amulet: 'Health Amulet \u2013 increases max HP by 2',
  empty_note: 'The note is blank, leaving more questions than answers.',
  focus_ring: 'A ring that sharpens concentration, boosting accuracy by 10%',
  commander_badge: 'Grants access from Twilight Field to Central Hub.'
};

export function markItemUsed(id) {
  if (!usedItems.includes(id)) usedItems.push(id);
}
