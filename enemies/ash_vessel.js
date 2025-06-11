export const ash_vessel = {
  id: 'ash_vessel',
  name: 'Ash Vessel',
  hp: 85,
  stats: { attack: 6, defense: 2 },
  xp: 24,
  skills: ['kindled_touch'],
  deathSkill: 'ashburst',
  behavior: 'aggressive',
  description: 'A vessel of smoldering ash that bursts into flame upon defeat.',
  drops: [{ item: 'volcanic_slag', quantity: 1 }]
};

export default ash_vessel;
