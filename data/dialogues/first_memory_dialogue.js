export const firstMemoryDialogue = [
  {
    text: 'A whisper of your name echoes from the mist.',
    options: [
      {
        label: 'Listen',
        goto: 1,
        memoryFlag: 'met_first_memory'
      },
      { label: 'Ignore it', goto: null }
    ]
  },
  {
    text: 'Fragments swirl, forming words you almost remember.',
    options: [
      { label: 'Reach toward them', goto: 2 },
      { label: 'Let them drift by', goto: 3 }
    ]
  },
  {
    text: 'The shards coalesce into a small crystal pulsing with recognition.',
    options: [
      {
        label: 'Take the shard',
        goto: 4,
        give: 'recall_shard'
      },
      { label: 'Leave it be', goto: 3 }
    ]
  },
  {
    text: 'The memory fades, leaving only silence.',
    options: [ { label: 'Continue on', goto: null } ]
  },
  {
    text: 'Emotion floods you as forgotten images flare and dim.',
    options: [
      {
        label: 'Hold the feeling',
        goto: null,
        memoryFlag: 'first_memory_seen',
        onChoose: () =>
          import('../../scripts/dialogue_state.js').then((m) => m.discoverLore('first_memory'))
      }
    ]
  }
];
