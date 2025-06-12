import { combatState, generateTurnQueue } from './combat_state.js';

export function initTurnOrder() {
  generateTurnQueue();
  combatState.activeEntity = combatState.turnQueue.shift() || null;
  return combatState.activeEntity;
}

export function nextTurn() {
  if (combatState.activeEntity) {
    combatState.turnQueue.push(combatState.activeEntity);
  }
  if (combatState.turnQueue.length === 0) {
    generateTurnQueue();
    combatState.round += 1;
  }
  combatState.activeEntity = combatState.turnQueue.shift() || null;
  return combatState.activeEntity;
}
