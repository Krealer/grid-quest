export const temple_warden = {
  id: 'temple_warden',
  name: 'Temple Warden',
  hp: 110,
  stats: { attack: 5, defense: 6 },
  xp: 22,
  skills: ['pillar_slam', 'sanctified_guard', 'ward_pulse'],
  behavior: 'defensive',
  description: 'Stonebound guardian of the temple halls.',
  drops: [{ item: 'polished_shard', quantity: 1 }]
};

export default temple_warden;
