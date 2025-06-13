/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/item_loader.js', () => ({
  loadItems: jest.fn(async () => ({})),
  getItemData: jest.fn(() => ({ name: 'Maze Key 1', description: '', category: 'key' }))
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
  getItemCount,
  getItemsByCategory,
  inventory;

beforeEach(async () => {
  jest.resetModules();
  ({ openChest } = await import('../scripts/chest.js'));
  ({ getItemCount, getItemsByCategory, inventory } = await import('../scripts/inventory.js'));
  inventory.length = 0;
});

test('maze_key_1 is acquired as key item from map07_maze01 chest', async () => {
  const chestId = 'map07_maze01:14,7';
  const result = await openChest(chestId);
  expect(result).not.toBeNull();
  expect(getItemCount('maze_key_1')).toBe(1);
  const keys = getItemsByCategory('key');
  const hasKey = keys.some((it) => it.id === 'maze_key_1');
  expect(hasKey).toBe(true);
});
