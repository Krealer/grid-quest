import { findPath } from '../scripts/pathfinder.js';

function makeGrid(layout) {
  return layout.map(row => row.split('').map(ch => ({ type: ch })));
}

describe('findPath', () => {
  test('finds a straight path in open terrain', () => {
    const grid = makeGrid([
      'GGG',
      'GGG',
      'GGG',
    ]);
    const path = findPath(grid, 0, 0, 2, 0);
    expect(path).toEqual([{ x: 1, y: 0 }, { x: 2, y: 0 }]);
  });

  test('avoids obstacles', () => {
    const grid = makeGrid([
      'GGG',
      'GCG',
      'GGG',
    ]);
    const path = findPath(grid, 0, 0, 2, 2);
    // path length should be 4 and should not pass through 1,1
    expect(path.length).toBe(4);
    expect(path).not.toContainEqual({ x: 1, y: 1 });
    const last = path[path.length - 1];
    expect(last).toEqual({ x: 2, y: 2 });
  });

  test('returns empty when target is blocked', () => {
    const grid = makeGrid([
      'GCG',
      'GGG',
      'GGG',
    ]);
    const path = findPath(grid, 0, 0, 1, 0);
    expect(path).toEqual([]);
  });

  test('returns empty when no path exists', () => {
    const grid = makeGrid([
      'GCG',
      'CCC',
      'GCG',
    ]);
    const path = findPath(grid, 0, 0, 2, 2);
    expect(path).toEqual([]);
  });

  test('returns empty when start equals target', () => {
    const grid = makeGrid([
      'GGG',
      'GGG',
      'GGG',
    ]);
    const path = findPath(grid, 1, 1, 1, 1);
    expect(path).toEqual([]);
  });
});
