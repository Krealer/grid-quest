export const lioranDialogue = [
  {
    text: 'A calm figure traces lines in the soil of this quiet glade.',
    options: [
      { label: 'Greet the scholar', goto: 1, memoryFlag: 'met_lioran' },
      { label: 'Leave quietly', goto: null }
    ]
  },
  {
    text: 'I am Lioran, the Measured. Patterns reveal much to those who listen.',
    options: [
      { label: 'Can those patterns aid me?', goto: 2 },
      { label: 'Interesting, but I must go.', goto: null }
    ]
  },
  {
    text: 'Take this Focus Ring. With it your strikes should seldom stray.',
    options: [
      {
        label: 'Accept the ring',
        goto: null,
        memoryFlag: 'lioran_ring_taken',
        onChoose: async () => {
          const { loadItems } = await import('../item_loader.js');
          await loadItems();
          const inv = await import('../inventory.js');
          inv.giveItem('focus_ring');
        }
      },
      {
        label: 'I have no need of trinkets.',
        goto: null,
        memoryFlag: 'lioran_ring_declined'
      }
    ]
  }
];
