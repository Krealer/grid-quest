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
  const players = livingPlayers();
  const enemies = livingEnemies();
  const allies = actor.isPlayer ? players : enemies;
  const foes = actor.isPlayer ? enemies : players;
  switch (type) {
    case 'self':
      return [actor];
    case 'enemy':
      return foes;
    case 'ally':
      return allies.filter((t) => t !== actor);
    case 'all_enemies':
      return foes;
    case 'all_allies':
      return allies;
    case 'any':
      return [...players, ...enemies];
    default:
      return [];
  }
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
  const targeting = skill.targeting || 'enemy';
  const candidates = getTargets(targeting, actor);
  let selected = targetOverride || getSelectedTarget();
  if (Array.isArray(selected)) {
    selected = selected.find((s) => candidates.includes(s)) || null;
  } else if (selected && !candidates.includes(selected)) {
    selected = null;
  }
  let chosen = selected;
  const needsChoice =
    actor.isPlayer &&
    candidates.length > 1 &&
    ['enemy', 'ally', 'any'].includes(targeting);
  if (!chosen && needsChoice) {
    chosen = await waitForTarget(skill, actor);
  }
  if (!chosen) chosen = candidates[0];
  const finalTargets =
    targeting === 'all_enemies' || targeting === 'all_allies'
      ? candidates
      : targeting === 'self'
        ? [actor]
        : chosen
          ? [chosen]
          : [];
  if (finalTargets[0]) selectTarget(finalTargets[0]);

  // prevent friendly fire
  const isPlayerTeam = (e) => e.isPlayer || e.isAlly;
  const filtered = finalTargets.filter((t) => {
    if (!isPlayerTeam(actor)) return true;
    if (isPlayerTeam(t) && skill.category === 'offensive') return false;
    if (!isPlayerTeam(t) && skill.category === 'defensive') return false;
    return true;
  });
  if (filtered.length === 0) return;

  executeSkill(skill, actor, filtered, {
    actor,
    caster: actor,
    targets: filtered,
    target: filtered[0],
    ...extra
  });
  const names = filtered.map((t) => t.name).join(', ');
  const message =
    `${actor.name} uses ${skill.name}` + (names ? ` on ${names}` : '');
  document.dispatchEvent(
    new CustomEvent('combatEvent', {
      detail: { type: 'skill', actor, skill, target: filtered[0], message }
    })
  );
}
