const advantages = {
  fire: 'earth',
  water: 'fire',
  earth: 'water'
};

const elementIcons = {
  fire: '🔥',
  water: '💧',
  earth: '🌿'
};

export function getElementMultiplier(attacker, defender) {
  if (!attacker || !defender) return 1;
  if (advantages[attacker] === defender) return 2;
  if (advantages[defender] === attacker) return 0.5;
  return 1;
}

export function formatElement(element) {
  if (!element) return '';
  return elementIcons[element] ?? element.charAt(0).toUpperCase() + element.slice(1);
}
