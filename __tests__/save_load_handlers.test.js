/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../ui/save_slots_menu.js', () => ({
  openSaveMenu: jest.fn(),
  openLoadMenu: jest.fn()
}));

jest.unstable_mockModule('../scripts/game_state.js', () => ({
  saveState: jest.fn(),
  loadState: jest.fn(),
  gameState: { currentMap: 'map01' }
}));

jest.unstable_mockModule('../scripts/save_load.js', () => ({
  saveGame: jest.fn(),
  loadGame: jest.fn(() => true)
}));

jest.unstable_mockModule('../ui/inventory_menu.js', () => ({
  refreshInventoryDisplay: jest.fn()
}));

jest.unstable_mockModule('../scripts/router.js', () => ({
  loadMap: jest.fn(() => Promise.resolve({ cols: 3 })),
  getCurrentMapName: jest.fn(() => 'map01')
}));

jest.unstable_mockModule('../scripts/fog_system.js', () => ({
  initFog: jest.fn(),
  revealAll: jest.fn(),
  reveal: jest.fn()
}));

jest.unstable_mockModule('../scripts/map_loader.js', () => ({
  isFogEnabled: jest.fn(() => false)
}));

jest.unstable_mockModule('../scripts/player.js', () => ({
  player: { x: 0, y: 0, maxHp: 100, hp: 50, level: 1 },
  updateStatsFromLevel: jest.fn()
}));

jest.unstable_mockModule('../scripts/ui/player_display.js', () => ({
  updateHpDisplay: jest.fn(),
  updateXpDisplay: jest.fn()
}));

jest.unstable_mockModule('../scripts/dialogue_system.js', () => ({
  showDialogue: jest.fn()
}));

let handlers, uiMenu, saveLoad, dialogueSys, playerModule;

beforeEach(async () => {
  jest.resetModules();
  handlers = await import('../scripts/save_load_handlers.js');
  uiMenu = await import('../ui/save_slots_menu.js');
  saveLoad = await import('../scripts/save_load.js');
  dialogueSys = await import('../scripts/dialogue_system.js');
  playerModule = await import('../scripts/player.js');
});

test('handleSave calls openSaveMenu', () => {
  handlers.handleSave();
  expect(uiMenu.openSaveMenu).toHaveBeenCalled();
});

test('handleLoad calls openLoadMenu', () => {
  handlers.handleLoad();
  expect(uiMenu.openLoadMenu).toHaveBeenCalled();
});

test('loadSavedGame loads map and updates stats', async () => {
  const container = document.createElement('div');
  const state = { cols: 0 };
  await handlers.loadSavedGame(1, container, state);
  expect(saveLoad.loadGame).toHaveBeenCalledWith(1);
  expect(saveLoad.saveGame).not.toHaveBeenCalled();
  expect(state.cols).toBe(3);
  expect(dialogueSys.showDialogue).toHaveBeenCalledWith(
    'Progress loaded successfully.'
  );
  expect(playerModule.updateStatsFromLevel).toHaveBeenCalled();
});

