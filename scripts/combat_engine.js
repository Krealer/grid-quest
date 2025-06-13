import {
  combatState,
  generateTurnQueue,
  livingPlayers,
  livingEnemies
} from './combat_state.js';
import { markActiveTile } from './grid_renderer.js';
import { selectTarget, getSelectedTarget } from './combat_state.js';
import {
  highlightSkillTargets,
  clearSkillTargetHighlights
} from './combat_ui.js';
import { tickStatuses } from './status_effects.js';
import { executeSkill } from './skill_engine.js';
import { getSkill } from './skills.js';
import { getEnemySkill } from './enemy_skills.js';

export function initTurnOrder() {
  generateTurnQueue();
  combatState.turnIndex = 0;
  combatState.activeEntity = combatState.turnQueue[0] || null;
  markActiveTile(combatState.activeEntity);
  document.dispatchEvent(
    new CustomEvent('turnStarted', { detail: combatState.activeEntity })
  );
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
  markActiveTile(combatState.activeEntity);
  document.dispatchEvent(
    new CustomEvent('turnStarted', { detail: combatState.activeEntity })
  );
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

function waitForTarget(skill, actor) {
  return new Promise((resolve) => {
    const handler = (entity) => {
      document.removeEventListener('keydown', escListener);
      clearSkillTargetHighlights();
      resolve(entity);
    };
    const escListener = (e) => {
      if (e.key === 'Escape') {
        clearSkillTargetHighlights();
        document.removeEventListener('keydown', escListener);
        resolve(null);
      }
    };
    document.addEventListener('keydown', escListener);
    highlightSkillTargets(
      skill,
      actor,
      combatState.players,
      combatState.enemies,
      handler
    );
  });
}

export async function executeAction(skill, actor, targetOverride, extra = {}) {
  if (!skill && actor?.selectedSkillId) {
    skill = actor.isPlayer
      ? getSkill(actor.selectedSkillId)
      : getEnemySkill(actor.selectedSkillId);
  }
  if (!skill) return;
  const targetType = skill.targetType || 'enemy';
  const targets = getTargets(targetType, actor);
  const selected = targetOverride || getSelectedTarget();
  let target = selected && targets.includes(selected) ? selected : null;
  if (
    !target &&
    actor.isPlayer &&
    targets.length > 1 &&
    targetType !== 'self' &&
    targetType !== 'allEnemies' &&
    targetType !== 'allAllies'
  ) {
    target = await waitForTarget(skill, actor);
  }
  if (!target) target = targets[0];
  if (target) selectTarget(target);
  executeSkill(skill, actor, target, { actor, target, ...extra });
  const message =
    `${actor.name} uses ${skill.name}` + (target ? ` on ${target.name}` : '');
  document.dispatchEvent(
    new CustomEvent('combatEvent', {
      detail: { type: 'skill', actor, skill, target, message }
    })
  );
}
