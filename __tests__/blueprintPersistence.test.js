/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let giveBlueprint, craftState, saveGame, loadGame;

beforeEach(async () => {
  jest.resetModules();
  ({ giveBlueprint } = await import('../scripts/dialogue_state.js'));
  ({ craftState } = await import('../scripts/craft_state.js'));
  ({ saveGame, loadGame } = await import('../scripts/save_load.js'));
  craftState.unlockedBlueprints = new Set();
  localStorage.clear();
});

test('unlocked blueprint persists through save/load', () => {
  giveBlueprint('defense_potion_I_blueprint');
  expect(craftState.unlockedBlueprints.has('defense_potion_I_blueprint')).toBe(true);

  saveGame(1);

  craftState.unlockedBlueprints.delete('defense_potion_I_blueprint');
  expect(craftState.unlockedBlueprints.has('defense_potion_I_blueprint')).toBe(false);

  const loaded = loadGame(1);
  expect(loaded).toBe(true);
  expect(craftState.unlockedBlueprints.has('defense_potion_I_blueprint')).toBe(true);
});
