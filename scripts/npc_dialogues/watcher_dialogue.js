export const watcherDialogue = [
  {
    text: 'You sense eyes upon you though none are seen.',
    options: [
      { label: 'Move quietly onward.', goto: null, onChoose: () => import('../dialogue_state.js').then(m => m.discoverLore('shadow_fork')) }
    ]
  }
];
