export const eryndorDialogue = [
  {
    id: 0,
    text: 'The fragments hum with forgotten energy...',
    options: [
      { label: 'What are they for?', goto: 1 },
      { label: "I'll be on my way.", goto: null }
    ]
  },
  {
    id: 1,
    text: 'Goblin gear and bone fragments can be refined into something useful.',
    options: [
      { label: 'Interesting.', goto: null },
      {
        label: 'Could you show me how?',
        goto: 2,
        condition: (state) =>
          (state.inventory['goblin_gear'] || 0) >= 1 &&
          (state.inventory['bone_fragment'] || 0) >= 1
      }
    ]
  },
  {
    id: 2,
    text: 'Very well. Hand them over, and I shall craft a potion.',
    options: [
      {
        label: 'Yes, here.',
        goto: null,
        remove: ['goblin_gear', 'bone_fragment'],
        give: 'defense_potion_I'
      },
      { label: 'On second thought…', goto: null }
    ]
  }
];
export default eryndorDialogue;
