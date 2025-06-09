import { loadJson } from './dataService.js';
import { inventory, removeItem, addItem } from './inventory.js';
import { getItemData } from './item_loader.js';
import { parseItemId, getItemDisplayName } from './inventory.js';

let upgrades = {};
let loaded = false;
let sessionActive = false;

export async function loadUpgradeData() {
  if (loaded) return upgrades;
  const data = await loadJson('data/upgrade_data.json');
  if (data) upgrades = data;
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
  const { baseId, level } = parseItemId(id);
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
  const { baseId, level } = parseItemId(id);
  const newLevel = level + 1;
  const newId = `${baseId}+${newLevel}`;
  const base = getItemData(baseId) || { name: baseId, description: '' };
  addItem({ id: newId, name: `${base.name} +${newLevel}`, description: base.description, quantity: 1 });
  return newId;
}

export function listUpgradeableItems() {
  return inventory.filter(it => canUpgrade(it.id));
}

