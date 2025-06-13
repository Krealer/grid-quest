/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/game_state.js', () => ({
  serializeGameState: jest.fn(() => ({ g: 1 })),
  deserializeGameState: jest.fn(),
  validateLoadedInventory: jest.fn(),
  gameState: { currentMap: 'map01' }
}));

jest.unstable_mockModule('../scripts/inventory_state.js', () => ({
  serializeInventory: jest.fn(() => ({ items: [] })),
  inventoryState: { loadFromObject: jest.fn() }
}));

jest.unstable_mockModule('../scripts/quest_state.js', () => ({
  serializeQuestState: jest.fn(() => ({ q: 1 })),
  deserializeQuestState: jest.fn()
}));

jest.unstable_mockModule('../scripts/player.js', () => ({
  serializePlayer: jest.fn(() => ({ lvl: 1 })),
  deserializePlayer: jest.fn(),
  player: {}
}));

jest.unstable_mockModule('../ui/inventory_menu.js', () => ({
  refreshInventoryDisplay: jest.fn()
}));

jest.unstable_mockModule('../scripts/inventory.js', () => ({
  inventory: []
}));

let saveGame, loadGame;
let game, invState, qState, playerMod;

beforeEach(async () => {
  jest.resetModules();
  ({ saveGame, loadGame } = await import('../scripts/save_load.js'));
  game = await import('../scripts/game_state.js');
  invState = await import('../scripts/inventory_state.js');
  qState = await import('../scripts/quest_state.js');
  playerMod = await import('../scripts/player.js');
});

test('saveGame writes data to localStorage', () => {
  jest.spyOn(Date, 'now').mockReturnValue(1000);
  saveGame(2);
  const raw = localStorage.getItem('game_save_slot_2');
  const data = JSON.parse(raw);
  expect(data.timestamp).toBe(1000);
  expect(data.mapName).toBe('map01');
  expect(data.game).toEqual({ g: 1 });
  expect(data.inventory).toEqual({ items: [] });
  expect(data.quests).toEqual({ q: 1 });
  expect(data.player).toEqual({ lvl: 1 });
  Date.now.mockRestore();
});

test('loadGame reads data and populates modules', () => {
  const obj = {
    timestamp: 1000,
    mapName: 'map01',
    itemCount: 0,
    game: { g: 2 },
    inventory: { items: [{ id: 'x', quantity: 2 }] },
    quests: { q: 2 },
    player: { lvl: 2 }
  };
  localStorage.setItem('game_save_slot_1', JSON.stringify(obj));

  const result = loadGame(1);
  expect(result).toBe(true);
  expect(game.deserializeGameState).toHaveBeenCalledWith({ g: 2 });
  expect(invState.inventoryState.loadFromObject).toHaveBeenCalledWith({ items: [{ id: 'x', quantity: 2 }] });
  expect(game.validateLoadedInventory).toHaveBeenCalledWith([{ id: 'x', quantity: 2 }]);
  expect(qState.deserializeQuestState).toHaveBeenCalledWith({ q: 2 });
  expect(playerMod.deserializePlayer).toHaveBeenCalledWith({ lvl: 2 });
});
