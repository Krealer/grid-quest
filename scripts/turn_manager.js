import { combatState } from './combat_state.js';

function getSpeed(unit) {
  return unit?.stats?.spd ?? unit?.stats?.speed ?? 0;
}

export function startRound() {
  const activeUnits = [...combatState.players, ...combatState.enemies].filter(
    (u) => u && u.hp > 0
  );
  activeUnits.sort((a, b) => {
    const diff = getSpeed(b) - getSpeed(a);
    if (diff !== 0) return diff;
    if (a.isPlayer && !b.isPlayer) return -1;
    if (!a.isPlayer && b.isPlayer) return 1;
    return Math.random() < 0.5 ? -1 : 1;
  });
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
  combatState.activeEntity = combatState.turnQueue[combatState.turnIndex] || null;
  return combatState.activeEntity;
}
