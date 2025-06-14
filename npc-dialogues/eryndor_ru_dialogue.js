export const eryndorDialogue = [
  {
    id: 0,
    text: 'Осколки гудят забытой силой...',
    options: [
      { label: 'Для чего они?', goto: 1 },
      { label: 'Мне пора.', goto: null }
    ]
  },
  {
    id: 1,
    text: 'Снаряжение гоблинов и костные фрагменты можно превратить во что-то полезное.',
    options: [
      { label: 'Любопытно.', goto: null },
      {
        label: 'Можешь показать?',
        goto: 2,
        condition: (state) =>
          (state.inventory['goblin_gear'] || 0) >= 1 &&
          (state.inventory['bone_fragment'] || 0) >= 1
      }
    ]
  },
  {
    id: 2,
    text: 'Хорошо. Отдай их мне, и я сварю зелье.',
    options: [
      {
        label: 'Держи.',
        goto: null,
        remove: ['goblin_gear', 'bone_fragment'],
        give: 'defense_potion_I'
      },
      { label: 'Я передумал…', goto: null }
    ]
  }
];
export default eryndorDialogue;
