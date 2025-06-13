import {
  combatState,
  selectTarget,
  getSelectedTarget
} from './combat_state.js';
import { executeAction, getTargets } from './combat_engine.js';

export const currentTurn = {
  unit: null,
  skill: null,
  target: null
};

export function beginTurn(unit) {
  currentTurn.unit = unit?.id || unit;
  currentTurn.skill = null;
  currentTurn.target = null;
  selectTarget(null);
}

export function chooseSkill(skillId) {
  currentTurn.skill = skillId;
}

export function chooseTarget(entity) {
  currentTurn.target = entity?.id || null;
  selectTarget(entity);
}

export async function resolveTurn(skillObj) {
  const actor = combatState.activeEntity;
  if (!actor || !skillObj) return;
  let override = null;
  if (!actor.isPlayer) {
    const list = getTargets(skillObj.targetType || 'enemy', actor);
    if (['enemy', 'ally', 'any'].includes(skillObj.targetType || 'enemy')) {
      override = list[0] || null;
    }
  }
  await executeAction(skillObj, actor, override);
  const sel = getSelectedTarget();
  currentTurn.target = sel?.id || null;
}
