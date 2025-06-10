import { loadEnemyData } from './enemy.js';

let table = null;

export async function getEnemyDrops(id) {
  if (!table) table = await loadEnemyData();
  const data = table[id];
  if (!data) return [];
  if (Array.isArray(data.drops)) return data.drops;
  if (data.drop) return [data.drop];
  return [];
}
