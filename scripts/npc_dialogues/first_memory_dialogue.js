export const firstMemoryDialogue = [
  {
    text: 'A faint echo of your past flickers before you.',
    options: [
      {
        label: 'Reach toward the memory.',
        goto: 1,
        onChoose: () =>
          import('../dialogue_state.js').then((m) =>
            m.discoverLore('first_memory')
          ),
        memoryFlag: 'first_memory_touched'
      },
      { label: 'Ignore it.', goto: null }
    ]
  },
  {
    text: 'Images swirl, revealing moments you thought lost.',
    options: [
      {
        label: 'Embrace what you see.',
        goto: 2,
        memoryFlag: 'first_memory_embraced'
      },
      { label: 'Turn away.', goto: 3, memoryFlag: 'first_memory_rejected' }
    ]
  },
  {
    text: 'Warmth fills you as the vision settles.',
    options: [{ label: 'Let it fade.', goto: null }]
  },
  {
    text: 'Doubt lingers as the vision dims.',
    options: [{ label: 'Leave it be.', goto: null }]
  }
];
