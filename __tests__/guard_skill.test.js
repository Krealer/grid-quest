/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let getSkill, applyDamage;

beforeEach(async () => {
  jest.resetModules();
  ({ getSkill } = await import('../scripts/skills.js'));
  ({ applyDamage } = await import('../scripts/logic.js'));
});

test('guard halves the next damage and resets flag', () => {
  const guard = getSkill('guard');
  const player = { name: 'Hero', hp: 20, guarding: false };
  const log = jest.fn();

  guard.effect({ caster: player, activateGuard: t => (t.guarding = true), log });

  const dealt = applyDamage(player, 10);

  expect(dealt).toBe(5);
  expect(player.hp).toBe(15);
  expect(player.guarding).toBe(false);
});
