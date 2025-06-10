export const firstMemoryDialogue = [
  {
    text: 'The fog parts, revealing a vision from long ago.',
    options: [
      {
        label: 'Watch carefully.',
        goto: 1,
        memoryFlag: 'first_memory_seen',
        onChoose: () =>
          import('../dialogue_state.js').then((m) =>
            m.discoverLore('first_memory')
          )
      },
      { label: 'Let it fade.', goto: null }
    ]
  },
  {
    text: 'The memory shimmers before dissolving back into fog.',
    options: [{ label: 'Continue on.', goto: null }]
  }
];
