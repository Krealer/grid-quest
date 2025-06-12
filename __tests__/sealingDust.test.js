/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/item_loader.js', () => ({
  loadItems: jest.fn(async () => ({})),
  getItemData: jest.fn(() => ({ name: 'Sealing Dust', description: '', category: 'key' }))
}));

jest.unstable_mockModule('../scripts/inventory_ui.js', () => ({
  updateInventoryUI: jest.fn()
}));

let solveSealPuzzle, getItemCount, inventory, serializeInventory, loadInventoryFromObject;

beforeEach(async () => {
  jest.resetModules();
  ({ solveSealPuzzle } = await import('../scripts/player_memory.js'));
  ({ getItemCount, inventory } = await import('../scripts/inventory.js'));
  ({ serializeInventory, loadInventoryFromObject } = await import('../scripts/inventory_state.js'));
  inventory.length = 0;
});

test('sealing_dust obtained from puzzle persists after save/load', async () => {
  await solveSealPuzzle();
  expect(getItemCount('sealing_dust')).toBe(1);
  const saved = serializeInventory();
  inventory.length = 0;
  loadInventoryFromObject(saved);
  expect(getItemCount('sealing_dust')).toBe(1);
});
