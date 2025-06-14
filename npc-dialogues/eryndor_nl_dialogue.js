export const eryndorDialogue = [
  {
    id: 0,
    text: 'De fragmenten trillen van vergeten energie...',
    options: [
      { label: 'Waar dienen ze voor?', goto: 1 },
      { label: 'Ik ga weer verder.', goto: null }
    ]
  },
  {
    id: 1,
    text: 'Goblinuitrusting en botfragmenten kun je omsmelten tot iets nuttigs.',
    options: [
      { label: 'Interessant.', goto: null },
      {
        label: 'Kun je het me laten zien?',
        goto: 2,
        condition: (state) =>
          (state.inventory['goblin_gear'] || 0) >= 1 &&
          (state.inventory['bone_fragment'] || 0) >= 1
      }
    ]
  },
  {
    id: 2,
    text: 'Goed dan. Geef ze maar, dan maak ik een drankje.',
    options: [
      {
        label: 'Ja, hier.',
        goto: null,
        remove: ['goblin_gear', 'bone_fragment'],
        give: 'defense_potion_I'
      },
      { label: 'Toch maar niet…', goto: null }
    ]
  }
];
export default eryndorDialogue;
