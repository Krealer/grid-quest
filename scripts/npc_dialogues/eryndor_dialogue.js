export const eryndorDialogue = [
  {
    text: 'These lands are littered with fragments of what once was.',
    options: [{ label: 'What can I do with them?', goto: 1 }]
  },
  {
    text: 'Some bones remember purpose. Some scraps still shield.',
    options: [
      { label: 'That sounds useful.', goto: 2 },
      { label: 'I prefer smashing things.', goto: null }
    ]
  },
  {
    text: 'Combine a bone fragment with some goblin gear. You\u2019ll find resilience in that.',
    options: [
      {
        label: 'Got it. Thanks.',
        goto: null,
        memoryFlag: 'learned_defense_potion_I',
        giveBlueprint: 'defense_potion_I_blueprint'
      }
    ]
  }
];
