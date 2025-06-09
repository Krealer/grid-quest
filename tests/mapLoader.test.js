import assert from 'node:assert';
import { test } from 'node:test';
import { normalizeGrid } from '../scripts/mapLoader.js';

test('normalizeGrid pads grid and converts strings', () => {
  const grid = [['A', 'B']];
  const result = normalizeGrid(grid, 5);
  assert.equal(result.length, 5);
  assert.equal(result[0].length, 5);
  assert.deepStrictEqual(result[0][0], { type: 'A' });
  assert.deepStrictEqual(result[0][1], { type: 'B' });
  assert.deepStrictEqual(result[4][4], { type: 'G' });
});
