export const shadeSageDialogue = [
  {
    text: "...A whisper on the wind. Few find this place.",
    options: [
      { label: "Who are you?", goto: 1 },
      { label: "I'll be going.", goto: null }
    ]
  },
  {
    text: "Names fade like mist. Seek the trials, and the hub will reveal more.",
    options: [
      { label: "What is this hub?", goto: 2 },
      { label: "Farewell.", goto: null }
    ]
  },
  {
    text: "It binds the paths of heroes. Remember what you learn here.",
    options: [
      { label: "I understand.", goto: null, onChoose: () => import('../../scripts/dialogue_state.js').then(m => m.discoverLore('hub_origins')) }
    ]
  }
];
