import assert from 'node:assert';
import { test } from 'node:test';
import { initEnemyState } from '../scripts/enemy.js';

test('initEnemyState sets defaults', () => {
  const enemy = {};
  initEnemyState(enemy);
  assert.deepStrictEqual(enemy.statuses, []);
  assert.equal(enemy.tempDefense, 0);
  assert.equal(enemy.tempAttack, 0);
});
