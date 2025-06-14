export const eryndorDialogue = [
  {
    id: 0,
    text: 'القطع تهتز بطاقة منسية...',
    options: [
      { label: 'بماذا تفيد؟', goto: 1 },
      { label: 'سأتابع طريقي.', goto: null }
    ]
  },
  {
    id: 1,
    text: 'عتاد العفاريت وقطع العظام يمكن صهرها لصنع شيء نافع.',
    options: [
      { label: 'مثير للاهتمام.', goto: null },
      {
        label: 'هل ترياني الكيفية؟',
        goto: 2,
        condition: (state) =>
          (state.inventory['goblin_gear'] || 0) >= 1 &&
          (state.inventory['bone_fragment'] || 0) >= 1
      }
    ]
  },
  {
    id: 2,
    text: 'حسنًا. سلمني إياها وسأصنع لك جرعة.',
    options: [
      {
        label: 'نعم، تفضل.',
        goto: null,
        remove: ['goblin_gear', 'bone_fragment'],
        give: 'defense_potion_I'
      },
      { label: 'بل لاحقًا…', goto: null }
    ]
  }
];
export default eryndorDialogue;
