export const combatState = {
  round: 1,
  players: [null, null, null],
  enemies: [null, null, null],
  turnQueue: [],
  turnIndex: 0,
  activeEntity: null,
  selectedTarget: null,
  autoBattle: false,
  currentAllyIndex: 0,
  selectedSkillId: null
};

export function initCombatState(player, enemy) {
  combatState.round = 1;
  combatState.players = [null, null, null];
  combatState.enemies = [null, null, null];
  const pList = Array.isArray(player) ? player : [player];
  const eList = Array.isArray(enemy) ? enemy : [enemy];
  pList.forEach((p, i) => {
    if (i < 3) combatState.players[i] = p;
  });
  eList.forEach((e, i) => {
    if (i < 3) combatState.enemies[i] = e;
  });
  combatState.players.forEach((p) => {
    p.selectedSkillId = null;
  });
  combatState.enemies.forEach((e) => {
    e.selectedSkillId = null;
  });
  combatState.turnQueue = [];
  combatState.turnIndex = 0;
  combatState.activeEntity = null;
  combatState.selectedTarget = null;
  combatState.currentAllyIndex = 0;
  combatState.selectedSkillId = null;
}

export function generateTurnQueue() {
  const livingPlayers = combatState.players.filter((p) => p && p.hp > 0);
  const livingEnemies = combatState.enemies.filter((e) => e && e.hp > 0);
  const all = [...livingPlayers, ...livingEnemies];
  all.sort((a, b) => {
    const diff = (b.stats?.speed ?? 0) - (a.stats?.speed ?? 0);
    if (diff !== 0) return diff;
    return Math.random() < 0.5 ? -1 : 1;
  });
  combatState.turnQueue = all.slice();
}

export function getPlayer() {
  return combatState.players[0] || null;
}

export function getEnemy() {
  return combatState.enemies[0] || null;
}

export function getActiveEntity() {
  return combatState.activeEntity;
}

export function selectTarget(entity) {
  combatState.selectedTarget = entity;
}

export function getSelectedTarget() {
  return combatState.selectedTarget;
}

export function livingPlayers() {
  return combatState.players.filter((p) => p && p.hp > 0);
}

export function livingEnemies() {
  return combatState.enemies.filter((e) => e && e.hp > 0);
}

export function getAllCombatants() {
  return [...combatState.players, ...combatState.enemies];
}

export function setAutoBattle(value) {
  combatState.autoBattle = Boolean(value);
}

export function isAutoBattle() {
  return combatState.autoBattle;
}
