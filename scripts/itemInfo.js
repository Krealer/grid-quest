import { loadItems } from './item_loader.js';
import { loadEnemyData } from './enemy.js';
import { getItemBonuses } from './item_stats.js';

let itemInfoList = [];
let loaded = false;

export async function loadItemInfo() {
  if (loaded) return itemInfoList;
  const items = await loadItems();
  const enemies = await loadEnemyData();

  const dropMap = {};
  Object.values(enemies).forEach((e) => {
    (e.drops || []).forEach((d) => {
      if (!dropMap[d.item]) dropMap[d.item] = new Set();
      dropMap[d.item].add(e.name);
    });
  });

  itemInfoList = Object.keys(items).map((id) => {
    const base = items[id];
    const bonuses = getItemBonuses(id);
    let effects = '';
    if (bonuses) {
      const arr = [];
      Object.entries(bonuses).forEach(([k, v]) => {
        if (k === 'slot') return;
        arr.push(`${k} +${v}`);
      });
      effects = arr.join(', ');
    } else if (base.effect) {
      const arr = [];
      Object.entries(base.effect).forEach(([k, v]) => {
        arr.push(`${k} +${v}`);
      });
      effects = arr.join(', ');
    }

    const dropped = dropMap[id] ? Array.from(dropMap[id]).join(', ') : '';

    return {
      id,
      name: base.name,
      description: base.description || '',
      drops: dropped,
      effects,
    };
  });

  loaded = true;
  return itemInfoList;
}

export function getAllItems() {
  return itemInfoList;
}
