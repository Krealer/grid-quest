export const warden_threshold = {
  id: 'warden_threshold',
  name: 'Warden of the Threshold',
  hp: 260,
  stats: { attack: 15, defense: 3 },
  xp: 110,
  skills: ['stone_lash', 'earthbind', 'resolve_break', 'quaking_step'],
  boss: true,
  behavior: 'balanced',
  description:
    'An ancient guardian forged to test those who would enter the temple.',
  drops: [{ item: 'temple_key', quantity: 1 }]
};

export default warden_threshold;
