import {
  combatState,
  generateTurnQueue,
  livingPlayers,
  livingEnemies
} from './combat_state.js';
import { tickStatuses } from './status_effects.js';

export function initTurnOrder() {
  generateTurnQueue();
  combatState.turnIndex = 0;
  combatState.activeEntity = combatState.turnQueue[0] || null;
  return combatState.activeEntity;
}

export function nextTurn() {
  if (combatState.activeEntity) {
    tickStatuses(combatState.activeEntity);
  }
  combatState.turnIndex += 1;
  if (combatState.turnIndex >= combatState.turnQueue.length) {
    generateTurnQueue();
    combatState.turnIndex = 0;
    combatState.round += 1;
  }
  combatState.activeEntity =
    combatState.turnQueue[combatState.turnIndex] || null;
  return combatState.activeEntity;
}

export function checkCombatEnd() {
  const allEnemiesDefeated = livingEnemies().every((e) => e.hp <= 0);
  const allPlayersDefeated = livingPlayers().every((p) => p.hp <= 0);
  if (allEnemiesDefeated) return 'victory';
  if (allPlayersDefeated) return 'defeat';
  return null;
}
