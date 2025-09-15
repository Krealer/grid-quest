export const classes = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Trained fighter with improved attack power.',
    bonuses: { attack: 3 }
  },
  {
    id: 'guardian',
    name: 'Guardian',
    description: 'Defensive specialist with extra protection.',
    bonuses: { defense: 3 }
  },
  {
    id: 'alchemist',
    name: 'Alchemist',
    description: 'Expert with concoctions; potions are more effective.',
    bonuses: { itemHealBonus: 1 }
  }
];

export function getClassInfo(id) {
  return classes.find((c) => c.id === id);
}

export function getAllClasses() {
  return classes;
}
