export const goblin_raider = {
  id: 'goblin_raider',
  name: 'Goblin Raider',
  hp: 65,
  stats: { attack: 4, defense: 1, speed: 6 },
  xp: 8,
  skills: ['goblin_scratch', 'goblin_rush'],
  behavior: 'aggressive',
  description: 'A scrappy goblin eager to prove himself with reckless strikes.',
  drops: [{ item: 'goblin_gear', quantity: 1 }]
};

export default goblin_raider;
