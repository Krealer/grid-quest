export function isAdjacent(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

export function generateTileId(x, y) {
  return `${x},${y}`;
}
