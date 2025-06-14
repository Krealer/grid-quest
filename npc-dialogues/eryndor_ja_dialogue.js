export const eryndorDialogue = [
  {
    id: 0,
    text: '欠片が忘れられた力で微かに震えている…',
    options: [
      { label: '何に使うんだい？', goto: 1 },
      { label: 'では失礼。', goto: null }
    ]
  },
  {
    id: 1,
    text: 'ゴブリンの装備と骨片を合わせれば役に立つ物になる。',
    options: [
      { label: '興味深い。', goto: null },
      {
        label: 'やり方を見せてくれないか？',
        goto: 2,
        condition: (state) =>
          (state.inventory['goblin_gear'] || 0) >= 1 &&
          (state.inventory['bone_fragment'] || 0) >= 1
      }
    ]
  },
  {
    id: 2,
    text: 'いいだろう。渡してみろ、薬にしてやる。',
    options: [
      {
        label: 'お願いします。',
        goto: null,
        remove: ['goblin_gear', 'bone_fragment'],
        give: 'defense_potion_I'
      },
      { label: 'やっぱりやめる。', goto: null }
    ]
  }
];
export default eryndorDialogue;
