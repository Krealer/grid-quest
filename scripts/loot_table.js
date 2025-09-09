import { loadEnemyData } from './enemy.js';

let table = null;

export async function getEnemyDrops(id) {
  if (!table) table = await loadEnemyData();
  const data = table[id];
  if (!data) return [];
  const results = [];
  const roll = (d) => {
    const chance = typeof d.chance === 'number' ? d.chance : 1;
    if (Math.random() < chance) results.push(d);
  };
  if (Array.isArray(data.drops)) data.drops.forEach(roll);
  else if (data.drop) roll(data.drop);
  return results;
}
