export const combatState = {
  round: 1,
  players: [],
  enemies: [],
  turnQueue: [],
  activeEntity: null
};

export function initCombatState(player, enemy) {
  combatState.round = 1;
  combatState.players = Array.isArray(player) ? player : [player];
  combatState.enemies = Array.isArray(enemy) ? enemy : [enemy];
  combatState.turnQueue = [];
  combatState.activeEntity = null;
}

export function generateTurnQueue() {
  const all = [...combatState.players, ...combatState.enemies];
  all.sort((a, b) => (b.stats?.speed ?? 0) - (a.stats?.speed ?? 0));
  combatState.turnQueue = all.slice();
}

export function getPlayer() {
  return combatState.players[0] || null;
}

export function getEnemy() {
  return combatState.enemies[0] || null;
}
