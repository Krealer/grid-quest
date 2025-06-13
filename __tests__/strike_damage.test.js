/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let getSkill, applyDamage;

beforeEach(async () => {
  jest.resetModules();
  ({ getSkill } = await import('../scripts/skills.js'));
  ({ applyDamage } = await import('../scripts/logic.js'));
});

test('strike applies damage equal to attack minus defense', () => {
  const strike = getSkill('strike');
  const player = { name: 'Hero', stats: { attack: 10 }, tempAttack: 0 };
  const enemy = { name: 'Dummy', hp: 20, stats: { defense: 3 } };
  const logs = [];
  const log = (msg) => logs.push(msg);

  strike.effect({
    caster: player,
    target: enemy,
    damageTarget: (t, amt) => applyDamage(t, amt),
    log
  });

  expect(enemy.hp).toBe(13);
  expect(logs[0]).toMatch(/Hero.*strikes.*7 damage/i);
});
