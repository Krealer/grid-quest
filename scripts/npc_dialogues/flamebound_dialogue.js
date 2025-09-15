export const flameboundDialogue = [
  {
    text: 'The heat is intense. A warrior wreathed in flame greets you.',
    options: [
      { label: 'Stand firm against the heat.', goto: null, onChoose: () => import('../dialogue_state.js').then(m => m.discoverLore('flame_fork')) }
    ]
  }
];
