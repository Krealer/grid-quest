export const itemBonuses = {
  cracked_helmet: { slot: 'armor', defense: 1 },
  'cracked_helmet+1': { slot: 'armor', defense: 2 },
  'cracked_helmet+2': { slot: 'armor', defense: 3 },
  'cracked_helmet+3': { slot: 'armor', defense: 4 },
  commander_badge: { slot: 'weapon', attack: 2 },
  health_amulet: { slot: 'accessory', maxHp: 5 },
  'health_amulet+1': { slot: 'accessory', maxHp: 6 },
  'health_amulet+2': { slot: 'accessory', maxHp: 7 },
  'health_amulet+3': { slot: 'accessory', maxHp: 8 },
};

export function getItemBonuses(id) {
  return itemBonuses[id] || null;
}
