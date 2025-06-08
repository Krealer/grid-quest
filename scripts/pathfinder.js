const WALKABLE = new Set(['G', 'D', 't', 'T', 'W']);

export function findPath(mapGrid, startX, startY, targetX, targetY) {
  const rows = mapGrid.length;
  const cols = mapGrid[0].length;

  if (
    targetX < 0 ||
    targetY < 0 ||
    targetX >= cols ||
    targetY >= rows ||
    !WALKABLE.has(mapGrid[targetY][targetX].type)
  ) {
    return [];
  }

  const open = [];
  const closed = new Set();
  const cameFrom = new Map();

  const key = (x, y) => `${x},${y}`;
  const heuristic = (x, y) => Math.abs(x - targetX) + Math.abs(y - targetY);

  open.push({ x: startX, y: startY, g: 0, f: heuristic(startX, startY) });

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    if (current.x === targetX && current.y === targetY) {
      return reconstructPath(cameFrom, current);
    }
    closed.add(key(current.x, current.y));

    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= cols ||
        ny >= rows ||
        !WALKABLE.has(mapGrid[ny][nx].type)
      ) {
        continue;
      }
      const nKey = key(nx, ny);
      if (closed.has(nKey)) {
        continue;
      }
      const g = current.g + 1;
      const h = heuristic(nx, ny);
      let node = open.find(n => n.x === nx && n.y === ny);
      if (!node) {
        open.push({ x: nx, y: ny, g, f: g + h });
        cameFrom.set(nKey, { x: current.x, y: current.y });
      } else if (g < node.g) {
        node.g = g;
        node.f = g + h;
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
