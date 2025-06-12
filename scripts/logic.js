export function isAdjacent(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

export function generateTileId(x, y) {
  return `${x},${y}`;
}

export function applyDamage(target, amount) {
  let dmg = amount;
  if (typeof target.damageTakenMod === 'number') {
    dmg *= target.damageTakenMod;
  }
  if (typeof target.absorb === 'number' && target.absorb > 0) {
    const absorbed = Math.min(target.absorb, dmg);
    dmg -= absorbed;
    target.absorb -= absorbed;
  }
  const defense = target.stats?.defense || 0;
  const reduction = Math.max(0, defense);
  const penalty = defense < 0 ? 1 + Math.abs(defense) * 0.1 : 1;
  dmg = Math.max(0, (dmg - reduction) * penalty);
  const final = Math.floor(dmg);
  if (target.hasResolve && target.hp - final <= 0) {
    const lost = target.hp - 1;
    target.hasResolve = false;
    target.hp = 1;
    return lost;
  }
  target.hp = Math.max(0, target.hp - final);
  return final;
}
