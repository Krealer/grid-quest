/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let calculateDamage, applyDamage;

beforeEach(async () => {
  jest.resetModules();
  ({ calculateDamage, applyDamage } = await import('../scripts/logic.js'));
});

test('calculateDamage handles defense and negative defense multiplier', () => {
  const normalTarget = { stats: { defense: 3 } };
  expect(calculateDamage(null, normalTarget, 8)).toBe(5);
  const negativeTarget = { stats: { defense: -2 } };
  expect(calculateDamage(null, negativeTarget, 5)).toBe(6);
});

test('applyDamage reduces hp and absorb correctly', () => {
  const target = { hp: 10, stats: { defense: 2 }, absorb: 3 };
  const dmg = applyDamage(target, 8);
  expect(dmg).toBe(3);
  expect(target.hp).toBe(7);
  expect(target.absorb).toBe(0);
});

test('applyDamage triggers resolve leaving 1 hp', () => {
  const target = { hp: 4, stats: { defense: 0 }, hasResolve: true };
  const dmg = applyDamage(target, 10);
  expect(dmg).toBe(3);
  expect(target.hp).toBe(1);
  expect(target.hasResolve).toBe(false);
});
