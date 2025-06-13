import {
  combatState,
  generateTurnQueue,
  livingPlayers,
  livingEnemies
} from './combat_state.js';
import { selectTarget, getSelectedTarget } from './combat_state.js';
import { tickStatuses } from './status_effects.js';
import { executeSkill } from './skill_engine.js';

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

export function getTargets(type, actor) {
  if (type === 'self') return [actor];
  if (type === 'enemy') {
    const list = actor.isPlayer ? livingEnemies() : livingPlayers();
    return list.filter((t) => t.hp > 0);
  }
  return [];
}

export function executeAction(skill, actor, targetOverride, extra = {}) {
  const targetType = skill.targetType || 'enemy';
  const targets = getTargets(targetType, actor);
  const selected = targetOverride || getSelectedTarget();
  const target = selected && targets.includes(selected) ? selected : targets[0];
  if (target) selectTarget(target);
  executeSkill(skill, actor, target, { actor, target, ...extra });
}
