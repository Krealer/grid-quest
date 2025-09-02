// Pathfinding utility for grid based movement. Walkability is
// determined by tile_type.js so the logic stays centralized.
import { isWalkable } from './tile_type.js';

import PriorityQueue from './priorityQueue.js';

export function findPath(mapGrid, startX, startY, targetX, targetY) {
  const rows = mapGrid.length;
  const cols = mapGrid[0].length;

  if (
    targetX < 0 ||
    targetY < 0 ||
    targetX >= cols ||
    targetY >= rows ||
    !isWalkable(mapGrid[targetY][targetX].type)
  ) {
    return [];
  }

  const openQueue = new PriorityQueue();
  const openMap = new Map();
  const closed = new Set();
  const cameFrom = new Map();

  const key = (x, y) => `${x},${y}`;
  const heuristic = (x, y) => Math.abs(x - targetX) + Math.abs(y - targetY);

  const startNode = { x: startX, y: startY, g: 0, f: heuristic(startX, startY) };
  openQueue.push(startNode);
  openMap.set(key(startX, startY), startNode);

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (!openQueue.isEmpty()) {
    const current = openQueue.pop();
    const cKey = key(current.x, current.y);
    if (openMap.get(cKey) !== current) {
      continue; // Skip outdated entry
    }
    openMap.delete(cKey);
    if (current.x === targetX && current.y === targetY) {
      return reconstructPath(cameFrom, current);
    }
    closed.add(cKey);

    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= cols ||
        ny >= rows ||
        !isWalkable(mapGrid[ny][nx].type)
      ) {
        continue;
      }
      const nKey = key(nx, ny);
      if (closed.has(nKey)) {
        continue;
      }
      const g = current.g + 1;
      const h = heuristic(nx, ny);
      const existing = openMap.get(nKey);
      if (!existing || g < existing.g) {
        const node = { x: nx, y: ny, g, f: g + h };
        openQueue.push(node);
        openMap.set(nKey, node);
        cameFrom.set(nKey, { x: current.x, y: current.y });
      }
    }
  }
  return [];
}

function reconstructPath(cameFrom, end) {
  const path = [];
  const key = p => `${p.x},${p.y}`;
  let current = end;
  while (cameFrom.has(key(current))) {
    path.unshift({ x: current.x, y: current.y });
    current = cameFrom.get(key(current));
  }
  return path;
}
