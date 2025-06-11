import { splitItemId } from './utils.js';
import { enchantments } from './enchantments.js';

export const itemBonuses = {
  cracked_helmet: { slot: 'armor', defense: 1 },
  'cracked_helmet+1': { slot: 'armor', defense: 2 },
  'cracked_helmet+2': { slot: 'armor', defense: 3 },
  'cracked_helmet+3': { slot: 'armor', defense: 4 },
  focus_ring: { slot: 'accessory' },
  forgotten_ring: { slot: 'accessory', attack: 1 },
  goblin_sword: { slot: 'weapon', attack: 3 },
  temple_sword: { slot: 'weapon', attack: 3 },
  temple_shell: { slot: 'armor', defense: 2, maxHp: 5 },
  temple_ring: { slot: 'accessory', attack: 1, defense: 1, maxHp: 2 }
};

export function getItemBonuses(id) {
  const { baseId, level, enchant } = splitItemId(id);
  const key = level > 0 ? `${baseId}+${level}` : baseId;
  const base = itemBonuses[key] || itemBonuses[baseId] || null;
  if (!enchant) return base;
  const ench = enchantments[enchant];
  if (!ench) return base;
  const combined = base ? { ...base } : {};
  Object.entries(ench.bonuses).forEach(([k, v]) => {
    combined[k] = (combined[k] || 0) + v;
  });
  return combined;
}
