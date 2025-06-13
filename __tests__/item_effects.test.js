/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/inventory.js', () => ({
  consumeItem: jest.fn()
}));

let useHealthPotion, useDefensePotion, useArcaneSpark, consumeItem;

beforeEach(async () => {
  jest.resetModules();
  ({ useHealthPotion, useDefensePotion, useArcaneSpark } = await import('../scripts/item_logic.js'));
  ({ consumeItem } = await import('../scripts/inventory.js'));
  consumeItem.mockReset();
});

test('useHealthPotion consumes item and heals', () => {
  consumeItem.mockReturnValue(true);
  const result = useHealthPotion();
  expect(consumeItem).toHaveBeenCalledWith('health_potion', 1);
  expect(result).toEqual({ heal: 20 });
});

test('useDefensePotion consumes item and buffs defense', () => {
  consumeItem.mockReturnValue(true);
  const result = useDefensePotion();
  expect(consumeItem).toHaveBeenCalledWith('defense_potion_I', 1);
  expect(result).toEqual({ defense: 1 });
});

test('useArcaneSpark deals damage when item available', () => {
  consumeItem.mockReturnValue(true);
  const result = useArcaneSpark();
  expect(consumeItem).toHaveBeenCalledWith('arcane_spark', 1);
  expect(result).toEqual({ damage: 6 });
});


test('item functions return null when item missing', () => {
  consumeItem.mockReturnValue(false);
  expect(useHealthPotion()).toBeNull();
  expect(useDefensePotion()).toBeNull();
  expect(useArcaneSpark()).toBeNull();
});
