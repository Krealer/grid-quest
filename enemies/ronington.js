export const ronington = {
  id: 'ronington',
  name: 'Ronington',
  hp: 70,
  stats: { attack: 5, defense: 0, speed: 7 },
  xp: 12,
  skills: ['flame_nip', 'ember_puff', 'tail_spark'],
  behavior: 'aggressive',
  description: 'A fiery baby dragon with surprising agility.',
  drops: [
    { item: 'baby_dragon_scale', quantity: 1 },
    { item: 'gem', quantity: 1, chance: 0.4 }
  ]
};

export default ronington;
