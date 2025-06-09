export function isAdjacent(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

export function generateTileId(x, y) {
  return `${x},${y}`;
}

export function applyDamage(target, amount) {
  const defense = target.stats?.defense || 0;
  const final = Math.max(0, amount - defense);
  target.hp = Math.max(0, target.hp - final);
  return final;
}
