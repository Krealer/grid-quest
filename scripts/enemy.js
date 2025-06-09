import { gameState } from './game_state.js';
import { showError } from './errorMessage.js';

let enemyData = {};

export async function loadEnemyData() {
  if (Object.keys(enemyData).length) return enemyData;
  try {
    const res = await fetch('data/enemies.json');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    enemyData = await res.json();
  } catch (err) {
    console.error('Failed to load enemy data', err);
    showError('Failed to load enemy data. Please try again later.');
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
}
