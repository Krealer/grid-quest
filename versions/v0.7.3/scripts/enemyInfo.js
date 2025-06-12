import { loadEnemyData } from './enemy.js';
import { loadItems, getItemData } from './item_loader.js';

let enemyInfoList = [];
let loaded = false;

export async function loadEnemyInfo() {
  if (loaded) return enemyInfoList;
  const enemies = await loadEnemyData();
  await loadItems();
  enemyInfoList = Object.keys(enemies).map(id => {
    const e = enemies[id];
    let drops = '';
    if (Array.isArray(e.drops) && e.drops.length) {
      drops = e.drops.map(d => {
        const item = getItemData(d.item) || { name: d.item };
        return `${item.name} x${d.quantity}`;
      }).join(', ');
    }
    return {
      id,
      name: e.name,
      description: e.description,
      drops
    };
  });
  loaded = true;
  return enemyInfoList;
}

export function getAllEnemies() {
  return enemyInfoList;
}
