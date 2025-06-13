import { getEnemySkill } from './enemy_skills.js';
import { chooseSkill as recordSkill, chooseTarget as recordTarget } from './turn_handler.js';
import { executeAction } from './combat_engine.js';
import { logAction } from './log.js';

function lowestHp(list) {
  return list.reduce((a, b) => (b.hp < a.hp ? b : a), list[0]);
}

function highestAtk(list) {
  return list.reduce(
    (a, b) => ((b.stats?.attack || 0) > (a.stats?.attack || 0) ? b : a),
    list[0]
  );
}

function lowestDef(list) {
  return list.reduce(
    (a, b) => ((b.stats?.defense || 0) < (a.stats?.defense || 0) ? b : a),
    list[0]
  );
}

export function chooseTarget(players, behavior = 'balanced') {
  const list = Array.isArray(players) ? players.filter(p => p.hp > 0) : [players];
  if (list.length === 0) return null;
  if (behavior === 'aggressive') return lowestHp(list);
  if (behavior === 'balanced') return highestAtk(list);
  if (behavior === 'cautious') {
    const clean = list.filter(p => !p.statuses || p.statuses.length === 0);
    const pool = clean.length > 0 ? clean : list;
    return lowestDef(pool);
  }
  return list[0];
}

export function chooseEnemySkill(entity) {
  const list = (entity.skills || ['strike'])
    .map((id) => getEnemySkill(id))
    .filter(Boolean);
  return list[0] || null;
}

export async function enemyAct(entity, players, context) {
  const skill = chooseEnemySkill(entity);
  if (!skill) return;
  let target = null;
  if (skill.targetType === 'self') {
    target = entity;
  } else {
    target = chooseTarget(players, entity.behavior);
  }
  if (!target) return;
  recordSkill(skill.id);
  recordTarget(target);
  logAction(entity, skill, target);
  await executeAction(skill, entity, target);
}

export async function takeTurn(entity, players, context) {
  await enemyAct(entity, players, context);
}
