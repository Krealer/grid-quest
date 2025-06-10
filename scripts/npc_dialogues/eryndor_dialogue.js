export const eryndorDialogue = [
  {
    text: 'A hooded figure blocks your path, gaze unreadable.',
    options: [
      { label: 'Who are you?', goto: 1 },
      { label: 'Step away', goto: null }
    ]
  },
  {
    text: "'Eryndor,' he says. 'I keep what others misuse.'",
    options: [
      { label: 'I seek your guidance.', goto: 2 },
      { label: 'Then I will not intrude.', goto: null, memoryFlag: 'eryndor_intro' }
    ]
  },
  {
    text: 'Knowledge has a price. Focus is the first payment.',
    options: [
      {
        label: 'Teach me',
        goto: 3
      },
      { label: 'Another time.', goto: null }
    ]
  },
  {
    text: 'He demonstrates a swift, precise strike.',
    options: [
      {
        label: 'Commit it to memory',
        goto: null,
        memoryFlag: 'eryndor_skill_given',
        onChoose: () =>
          import('../player.js').then((m) => m.grantSkill('focus_strike'))
      }
    ]
  }
];
