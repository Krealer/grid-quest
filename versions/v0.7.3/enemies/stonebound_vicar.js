export const stonebound_vicar = {
  id: 'stonebound_vicar',
  name: 'Stonebound Vicar',
  hp: 140,
  stats: { attack: 7, defense: 6 },
  xp: 40,
  skills: ['stone_pulse', 'sacred_bind', 'blessed_quake'],
  behavior: 'defensive',
  description:
    'An elite priest bound to sacred stone, guarding the temple depths.',
  drops: [{ item: 'vicar_sigil', quantity: 1 }]
};

export default stonebound_vicar;
