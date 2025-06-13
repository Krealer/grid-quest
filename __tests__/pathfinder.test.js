/** @jest-environment jsdom */
import { findPath } from '../scripts/pathfinder.js';

const grid = [
  [{ type: 'G' }, { type: 'G' }, { type: 'G' }],
  [{ type: 'F' }, { type: 'F' }, { type: 'G' }],
  [{ type: 'G' }, { type: 'G' }, { type: 'G' }]
];

test('findPath returns shortest walkable path', () => {
  const path = findPath(grid, 0, 0, 2, 2);
  const coords = path.map(p => [p.x, p.y]);
  expect(coords).toEqual([
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2]
  ]);
});
