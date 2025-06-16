export function isAdjacent(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

export function generateTileId(x, y) {
  return `${x},${y}`;
}

export function calculateDamage(attacker, target, baseDamage) {
  let defense = 0;
  if (typeof target.defense === 'number') {
    defense = target.defense;
  } else if (target.stats && typeof target.stats.defense === 'number') {
    defense = target.stats.defense;
  } else if (typeof target.def === 'number') {
    defense = target.def + (target.stats?.defense || 0);
  }
  const effectiveDefense = Math.max(defense, 0);
  const multiplier = defense < 0 ? 1 + 0.1 * Math.abs(defense) : 1;
  const damage = Math.max((baseDamage - effectiveDefense) * multiplier, 0);
  return Math.floor(damage);
}

export function applyDamage(target, amount) {
  let dmg = amount;
  if (target.guarding || target.hasGuard) {
    dmg = Math.floor(dmg / 2);
    target.guarding = false;
    target.hasGuard = false;
  }
  if (typeof target.damageTakenMod === 'number') {
    dmg *= target.damageTakenMod;
  }
  if (typeof target.absorb === 'number' && target.absorb > 0) {
    const absorbed = Math.min(target.absorb, dmg);
    dmg -= absorbed;
    target.absorb -= absorbed;
  }
  const final = calculateDamage(null, target, dmg);
  if (target.hasResolve && target.hp - final <= 0) {
    const lost = target.hp - 1;
    target.hasResolve = false;
    target.hp = 1;
    return lost;
  }
  target.hp = Math.max(0, target.hp - final);
  return final;
}
