export const usedItems = [];

export const itemDescriptions = {
  map02_key: 'Unlocks the door from Rainy Crossroads to Twilight Field.',
  health_potion: 'Health Potion \u2013 permanently increases max HP by 1',
  health_amulet: 'Health Amulet \u2013 increases max HP by 2 when crafted',
  empty_note: 'The note is blank, leaving more questions than answers.',
  focus_ring: 'A ring that sharpens concentration, boosting accuracy by 10%',
  commander_badge: 'Grants access from Twilight Field to Central Hub.',
  faded_blade:
    "Vaelin's old weapon. Using it in combat grants +2 attack for that battle."
};

export function markItemUsed(id) {
  if (!usedItems.includes(id)) usedItems.push(id);
}
