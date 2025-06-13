import { combatState, selectTarget, getSelectedTarget } from './combat_state.js';
import { executeAction } from './combat_engine.js';

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

export function resolveTurn(skillObj) {
  const actor = combatState.activeEntity;
  const target = getSelectedTarget();
  if (!actor || !skillObj) return;
  executeAction(skillObj, actor);
  currentTurn.target = target?.id || null;
}
