import { loadJson } from './data_service.js';
import { showError } from './error_prompt.js';
import { inventory, removeItem, addItem } from './inventory.js';
import { getItemData } from './item_loader.js';
import { getItemDisplayName } from './inventory.js';
import { splitItemId } from './utils.js';
import { getRandomEnchantment, getEnchantmentData, enchantments } from './enchantments.js';

let upgrades = {};
let loaded = false;
let sessionActive = false;

export async function loadUpgradeData() {
  if (loaded) return upgrades;
  try {
    const data = await loadJson('../data/upgrade_data.json');
    upgrades = data;
  } catch (err) {
    upgrades = {};
    showError(err.message || 'Failed to load upgrade data');
  }
  loaded = true;
  return upgrades;
}

export function beginForgeSession() {
  sessionActive = true;
}

export function endForgeSession() {
  sessionActive = false;
}

export function canUpgrade(id) {
  if (!sessionActive) return false;
  const info = getUpgradeInfo(id);
  if (!info) return false;
  const { material, cost } = info;
  const have = inventory.find(it => it.id === material)?.quantity || 0;
  return have >= cost;
}

export function getUpgradeInfo(id) {
  const { baseId, level } = splitItemId(id);
  const info = upgrades[baseId];
  if (!info) return null;
  if (level >= info.maxLevel) return null;
  return info;
}

export async function upgradeItem(id) {
  await loadUpgradeData();
  const info = getUpgradeInfo(id);
  if (!info) return false;
  if (!canUpgrade(id)) return false;
  removeItem(info.material, info.cost);
  removeItem(id, 1);
  const { baseId, level, enchant } = splitItemId(id);
  const newLevel = level + 1;
  let newEnchant = enchant;
  if (!newEnchant && Math.random() < 0.3) {
    newEnchant = getRandomEnchantment();
  }
  let newId = `${baseId}+${newLevel}`;
  if (newEnchant) newId += `#${newEnchant}`;
  const base = getItemData(baseId) || { name: baseId, description: '' };
  const enchName = newEnchant ? ` ${getEnchantmentData(newEnchant).name}` : '';
  addItem({ id: newId, name: `${base.name} +${newLevel}${enchName}`, description: base.description, quantity: 1 });
  return newId;
}

export function listUpgradeableItems() {
  return inventory.filter(it => canUpgrade(it.id));
}

export function canReroll(id) {
  if (!sessionActive) return false;
  const { enchant } = splitItemId(id);
  if (!enchant) return false;
  const dust = inventory.find(it => it.id === 'mystic_dust')?.quantity || 0;
  const crystal = inventory.find(it => it.id === 'arcane_crystal')?.quantity || 0;
  return dust > 0 || crystal > 0;
}

export function listRerollableItems() {
  return inventory.filter(it => canReroll(it.id));
}

export function rerollEnchantment(id) {
  if (!canReroll(id)) return null;
  const dust = inventory.find(it => it.id === 'mystic_dust')?.quantity || 0;
  const costItem = dust > 0 ? 'mystic_dust' : 'arcane_crystal';
  removeItem(costItem, 1);
  removeItem(id, 1);
  const { baseId, level, enchant } = splitItemId(id);
  let newEnchant = enchant;
  const all = Object.keys(enchantments);
  if (all.length > 1) {
    while (newEnchant === enchant) {
      newEnchant = getRandomEnchantment();
    }
  } else {
    newEnchant = getRandomEnchantment();
  }
  let newId = baseId;
  if (level > 0) newId += `+${level}`;
  if (newEnchant) newId += `#${newEnchant}`;
  const base = getItemData(baseId) || { name: baseId, description: '' };
  const levelPart = level > 0 ? ` +${level}` : '';
  const enchName = newEnchant ? ` ${getEnchantmentData(newEnchant).name}` : '';
  addItem({ id: newId, name: `${base.name}${levelPart}${enchName}`, description: base.description, quantity: 1 });
  return newId;
}

