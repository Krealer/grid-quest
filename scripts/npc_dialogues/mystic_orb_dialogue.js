import { startDialogueTree } from '../dialogueSystem.js';

export const mysticOrbDialogue = [
  {
    text: 'The orb pulses with energy. What do you seek?',
    options: [
      { label: 'Teach me courage.', goto: 1 },
      { label: 'Share some wisdom.', goto: 2 },
      {
        label: 'Let fate decide.',
        goto: null,
        onChoose: () => {
          const next = 3 + Math.floor(Math.random() * 3);
          startDialogueTree(mysticOrbDialogue, next);
        }
      }
    ]
  },
  {
    text: 'Courage is a choice made in quiet moments.',
    options: [{ label: 'I will remember.', goto: null }]
  },
  {
    text: 'Wisdom comes to those who listen.',
    options: [{ label: 'Thank you.', goto: null }]
  },
  {
    text: 'A hidden treasure lies on your path.',
    options: [{ label: 'Intriguing.', goto: null }]
  },
  {
    text: 'Beware, a trap awaits ahead.',
    options: [{ label: 'I shall be cautious.', goto: null }]
  },
  {
    text: 'An ally will soon cross your journey.',
    options: [{ label: 'Good news.', goto: null }]
  }
];

