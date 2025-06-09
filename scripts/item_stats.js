export const itemBonuses = {
  cracked_helmet: { slot: 'armor', defense: 1 },
  commander_badge: { slot: 'weapon', attack: 2 },
  health_amulet: { slot: 'accessory', maxHp: 5 },
};

export function getItemBonuses(id) {
  return itemBonuses[id] || null;
}
