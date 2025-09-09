const advantages = {
  fire: 'earth',
  water: 'fire',
  earth: 'water'
};

export function getElementMultiplier(attacker, defender) {
  if (!attacker || !defender) return 1;
  if (advantages[attacker] === defender) return 2;
  if (advantages[defender] === attacker) return 0.5;
  return 1;
}

export function formatElement(element) {
  if (!element) return '';
  return element.charAt(0).toUpperCase() + element.slice(1);
}
