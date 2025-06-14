import { combatState } from './combat_state.js';

function getSpeed(unit) {
  return unit?.stats?.spd ?? unit?.stats?.speed ?? 0;
}

export function startRound() {
  const activeUnits = [...combatState.players, ...combatState.enemies].filter(
    (u) => u && u.hp > 0
  );
  activeUnits.sort((a, b) => getSpeed(b) - getSpeed(a));
  combatState.turnQueue = activeUnits.slice();
  combatState.turnIndex = 0;
  combatState.activeEntity = combatState.turnQueue[0] || null;
}

export function nextTurn() {
  combatState.turnIndex += 1;
  if (combatState.turnIndex >= combatState.turnQueue.length) {
    startRound();
    combatState.round += 1;
  }
  combatState.activeEntity =
    combatState.turnQueue[combatState.turnIndex] || null;
  return combatState.activeEntity;
}

export function getQueue() {
  return combatState.turnQueue.slice();
}

export function proceedToNextTurn() {
  return nextTurn();
}
