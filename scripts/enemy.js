import { gameState } from './game_state.js';
import { showError } from './error_prompt.js';
import { loadJson } from './data_service.js';

let enemyData = {};

export async function loadEnemyData() {
  if (Object.keys(enemyData).length) return enemyData;
  try {
    const data = await loadJson('data/enemies.json');
    enemyData = data;
  } catch (err) {
    enemyData = {};
    showError(err.message || 'Failed to load enemies');
  }
  return enemyData;
}

export function getEnemyData(id) {
  return enemyData[id];
}

export function isEnemyDefeated(id) {
  return gameState.defeatedEnemies.has(id);
}

export function defeatEnemy(id) {
  gameState.defeatedEnemies.add(id);
}

export function initEnemyState(enemy) {
  if (!enemy) return;
  if (!Array.isArray(enemy.statuses)) enemy.statuses = [];
  if (typeof enemy.tempDefense !== 'number') enemy.tempDefense = 0;
  if (typeof enemy.tempAttack !== 'number') enemy.tempAttack = 0;
  enemy.isPlayer = false;
}
