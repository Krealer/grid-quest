export const combatState = {
  round: 1,
  players: [],
  enemies: [],
  turnQueue: [],
  activeEntity: null,
  selectedTarget: null
};

export function initCombatState(player, enemy) {
  combatState.round = 1;
  combatState.players = Array.isArray(player) ? player : [player];
  combatState.enemies = Array.isArray(enemy) ? enemy : [enemy];
  combatState.turnQueue = [];
  combatState.activeEntity = null;
  combatState.selectedTarget = null;
}

export function generateTurnQueue() {
  const livingPlayers = combatState.players.filter((p) => p.hp > 0);
  const livingEnemies = combatState.enemies.filter((e) => e.hp > 0);
  const all = [...livingPlayers, ...livingEnemies];
  all.sort((a, b) => (b.stats?.speed ?? 0) - (a.stats?.speed ?? 0));
  combatState.turnQueue = all.slice();
}

export function getPlayer() {
  return combatState.players[0] || null;
}

export function getEnemy() {
  return combatState.enemies[0] || null;
}

export function selectTarget(entity) {
  combatState.selectedTarget = entity;
}

export function getSelectedTarget() {
  return combatState.selectedTarget;
}

export function livingPlayers() {
  return combatState.players.filter((p) => p.hp > 0);
}

export function livingEnemies() {
  return combatState.enemies.filter((e) => e.hp > 0);
}
