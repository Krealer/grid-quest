import { getEnemySkill } from './enemy_skills.js';

export function chooseEnemySkill(entity) {
  const list = (entity.skills || ['strike'])
    .map((id) => getEnemySkill(id))
    .filter(Boolean);
  return list[0] || null;
}

export function enemyAct(entity, players, context) {
  const target = Array.isArray(players)
    ? players.find((p) => p.hp > 0) || players[0]
    : players;
  const skill = chooseEnemySkill(entity);
  if (!skill || !target) return;
  skill.effect({ user: entity, target, ...context });
}

export function takeTurn(entity, players, context) {
  enemyAct(entity, players, context);
}
