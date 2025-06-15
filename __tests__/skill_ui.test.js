/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/combat_ui.js', () => ({
  setSkillDisabledState: jest.fn()
}));

let updateSkillDisableState, combatUi;

beforeEach(async () => {
  jest.resetModules();
  ({ updateSkillDisableState } = await import('../scripts/skill_ui.js'));
  combatUi = await import('../scripts/combat_ui.js');
});

test('updateSkillDisableState passes silenced flag', () => {
  const player = { statuses: [{ id: 'silence', remaining: 1 }] };
  const btns = {};
  const lookup = {};
  const cds = { x: 1 };
  updateSkillDisableState(btns, lookup, player, cds);
  expect(combatUi.setSkillDisabledState).toHaveBeenCalledWith(btns, lookup, true, cds);
});

test('updateSkillDisableState handles no silence', () => {
  const player = { statuses: [] };
  const btns = {};
  const lookup = {};
  updateSkillDisableState(btns, lookup, player);
  expect(combatUi.setSkillDisabledState).toHaveBeenCalledWith(btns, lookup, false, {});
});
