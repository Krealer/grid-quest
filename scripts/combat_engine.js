import { combatState, livingPlayers, livingEnemies } from './combat_state.js';
import { startRound, nextTurn as queueNextTurn } from './turn_manager.js';
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
import { flashElement, floatTextOver } from './animation_utils.js';

function getCombatantEl(entity) {
  const overlay = document.getElementById('battle-overlay');
  if (!overlay || !entity) return null;
  const idx = entity.isPlayer || entity.isAlly
    ? combatState.players.indexOf(entity)
    : combatState.enemies.indexOf(entity);
  const selector = entity.isPlayer || entity.isAlly
    ? `.player-team .combatant[data-index="${idx}"]`
    : `.enemy-team .combatant[data-index="${idx}"]`;
  return overlay.querySelector(selector);
}

export function initTurnOrder() {
  startRound();
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
  queueNextTurn();
  combatState.activeEntity = combatState.turnQueue[combatState.turnIndex] || null;
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
  const targeting = skill.targetType || 'enemy';
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

  const before = filtered.map((t) => ({
    hp: t.hp,
    statuses: (t.statuses || []).map((s) => s.id)
  }));

  executeSkill(skill, actor, filtered, {
    actor,
    caster: actor,
    targets: filtered,
    target: filtered[0],
    ...extra
  });

  const after = filtered.map((t) => ({
    hp: t.hp,
    statuses: (t.statuses || []).map((s) => s.id)
  }));

  const isAoe =
    skill.targetType === 'all_enemies' || skill.targetType === 'all_allies';
  filtered.forEach((t, i) => {
    const el = getCombatantEl(t);
    const diff = after[i].hp - before[i].hp;
    const delay = isAoe ? i * 150 : 0;
    if (!el) return;
    setTimeout(() => {
      if (diff < 0) {
        flashElement(el, 'hit');
        floatTextOver(el, String(diff), { color: 'red' });
      } else if (diff > 0) {
        flashElement(el, 'heal');
        floatTextOver(el, `+${diff}`, { color: 'limegreen' });
      }
      const added = after[i].statuses.filter((s) => !before[i].statuses.includes(s));
      added.forEach((id, idx) => {
        setTimeout(() => floatTextOver(el, id, { color: 'yellow' }), idx * 150);
      });
    }, delay);
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

export async function startPlayerTurn(unit) {
  if (!unit) return;
  const overlay = document.getElementById('battle-overlay');
  if (!overlay) return;
  const skillIds = unit.learnedSkills || unit.skills || [];
  const skills = skillIds
    .map((id) => (unit.isPlayer ? getSkill(id) : getEnemySkill(id)))
    .filter(Boolean);
  const { chooseSkillAndTarget } = await import('./combat_ui.js');
  const res = await chooseSkillAndTarget(overlay, unit, skills);
  if (!res || !res.skill) return;
  await executeAction(res.skill, unit, res.target || null);
  proceedToNextTurn();
}

export function proceedToNextTurn() {
  return nextTurn();
}
