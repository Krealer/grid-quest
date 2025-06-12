export function isAdjacent(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

export function generateTileId(x, y) {
  return `${x},${y}`;
}

export function calculateDamage(attacker, target, baseDamage) {
  const defense = target.stats?.defense ?? target.defense ?? 0;
  const effectiveDefense = Math.max(defense, 0);
  const penaltyMultiplier = defense < 0 ? 1 + 0.1 * Math.abs(defense) : 1;
  const rawDamage = baseDamage - effectiveDefense;
  const amplified = Math.floor(rawDamage * penaltyMultiplier);
  return Math.max(amplified, 0);
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
