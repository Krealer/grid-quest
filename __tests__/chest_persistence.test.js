/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/item_loader.js', () => ({
  loadItems: jest.fn(async () => ({})),
  getItemData: jest.fn(() => ({ name: 'Rusty Key', description: '' }))
}));

jest.unstable_mockModule('../scripts/inventory_ui.js', () => ({
  updateInventoryUI: jest.fn()
}));

jest.unstable_mockModule('../scripts/dialogue_state.js', () => ({
  giveRelic: jest.fn(),
  setMemory: jest.fn()
}));

jest.unstable_mockModule('../scripts/player.js', () => ({
  increaseMaxHp: jest.fn(),
  loseHpNonLethal: jest.fn()
}));


let openChest,
  isChestOpened,
  setOpenedChests,
  saveGame,
  loadGame,
  getItemCount,
  inventory;

beforeEach(async () => {
  jest.resetModules();
  ({ openChest, isChestOpened, setOpenedChests } = await import(
    '../scripts/chest.js'
  ));
  ({ saveGame, loadGame } = await import('../scripts/save_load.js'));
  ({ getItemCount, inventory } = await import('../scripts/inventory.js'));
  inventory.length = 0;
  localStorage.clear();
});

test('opened chests remain opened after saving and loading', async () => {
  const chestId = 'map01:10,5';
  const result = await openChest(chestId);
  expect(result).not.toBeNull();
  expect(isChestOpened(chestId)).toBe(true);
  expect(getItemCount('rusty_key')).toBe(1);

  saveGame(1);

  setOpenedChests([]);
  inventory.length = 0;
  expect(isChestOpened(chestId)).toBe(false);

  const loaded = loadGame(1);
  expect(loaded).toBe(true);
  expect(isChestOpened(chestId)).toBe(true);
  expect(getItemCount('rusty_key')).toBe(1);

  const second = await openChest(chestId);
  expect(second).toBeNull();
  expect(getItemCount('rusty_key')).toBe(1);
});
