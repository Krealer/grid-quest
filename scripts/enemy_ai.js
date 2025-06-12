import { getEnemySkill } from './enemy_skills.js';

export function chooseEnemySkill(entity) {
  const list = (entity.skills || ['strike'])
    .map((id) => getEnemySkill(id))
    .filter(Boolean);
  return list[0] || null;
}

export function enemyAct(entity, player, context) {
  const skill = chooseEnemySkill(entity);
  if (!skill) return;
  skill.effect({ enemy: entity, player, ...context });
}
