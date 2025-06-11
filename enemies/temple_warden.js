export const temple_warden = {
  id: 'temple_warden',
  name: 'Temple Warden',
  hp: 80,
  stats: { attack: 3, defense: 5 },
  xp: 18,
  skills: ['strike', 'reflect_shell'],
  behavior: 'defensive',
  description: 'A stalwart guardian protecting the temple halls.',
  drops: [{ item: 'warden_crest', quantity: 1 }]
};

export default temple_warden;
