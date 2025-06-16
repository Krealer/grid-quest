/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let markChestAsCut,
  setCutChests,
  getCutChests,
  setOpenedChests,
  getOpenedChests,
  saveGame,
  loadGame;

beforeEach(async () => {
  jest.resetModules();
  ({
    markChestAsCut,
    setCutChests,
    getCutChests,
    setOpenedChests,
    getOpenedChests
  } = await import('../scripts/chest.js'));
  ({ saveGame, loadGame } = await import('../scripts/save_load.js'));
  localStorage.clear();
  setOpenedChests([]);
  setCutChests([]);
});

test('cut chests remain removed after saving and loading', () => {
  const chestId = 'map01:10,5';
  markChestAsCut(chestId);
  expect(getCutChests()).toContain(chestId);

  saveGame(1);

  setCutChests([]);
  setOpenedChests([]);
  expect(getCutChests()).not.toContain(chestId);

  const loaded = loadGame(1);
  expect(loaded).toBe(true);
  expect(getCutChests()).toContain(chestId);
  expect(getOpenedChests()).not.toContain(chestId);
});
