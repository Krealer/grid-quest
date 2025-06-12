import {
  combatState,
  generateTurnQueue,
  livingPlayers,
  livingEnemies
} from './combat_state.js';

export function initTurnOrder() {
  generateTurnQueue();
  combatState.activeEntity = combatState.turnQueue.shift() || null;
  return combatState.activeEntity;
}

export function nextTurn() {
  if (combatState.activeEntity) {
    if (combatState.activeEntity.hp > 0)
      combatState.turnQueue.push(combatState.activeEntity);
  }
  if (combatState.turnQueue.length === 0) {
    generateTurnQueue();
    combatState.round += 1;
  }
  combatState.activeEntity = combatState.turnQueue.shift() || null;
  return combatState.activeEntity;
}

export function checkCombatEnd() {
  const allEnemiesDefeated = livingEnemies().every((e) => e.hp <= 0);
  const allPlayersDefeated = livingPlayers().every((p) => p.hp <= 0);
  if (allEnemiesDefeated) return 'victory';
  if (allPlayersDefeated) return 'defeat';
  return null;
}
