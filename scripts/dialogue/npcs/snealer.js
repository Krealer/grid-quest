export default {
  name: 'Snealer, the Whisperer',
  start: {
    text: 'Psst... not all treasures are in chests, you know.',
    labels: [
      { text: 'What do you mean?', goto: 1 },
      { text: 'You look suspicious.', goto: 2 },
      { text: 'I\u2019ll be going.', goto: null }
    ]
  },
  1: {
    text: 'Some secrets lie where footsteps vanish...',
    labels: [
      { text: 'Where should I look?', goto: 3 },
      { text: 'Sounds like nonsense.', goto: null }
    ]
  },
  2: {
    text: 'Suspicious? Me? I\u2019m just a humble observer of the unseen.',
    labels: [
      { text: 'Observer of what exactly?', goto: 4 },
      { text: 'Still sounds suspicious.', goto: null }
    ]
  },
  3: {
    text: 'If you can answer this: What walks without a sound, and lives only when no one\u2019s around?',
    labels: [
      { text: 'A shadow?', goto: 5 },
      { text: 'A ghost?', goto: 6 },
      { text: 'No idea.', goto: null }
    ]
  },
  4: {
    text: 'The sort of things that disappear when light hits them...',
    labels: [{ text: 'Interesting.', goto: null }]
  },
  5: {
    text: 'Sharp. I wasn\u2019t sure you had it in you.',
    givesItem: { item: 'shadow_token', quantity: 1 },
    labels: [
      { text: 'What is this token?', goto: 7 },
      { text: 'Thanks.', goto: null }
    ]
  },
  6: {
    text: 'Heh. Close, but shadows don\u2019t haunt.',
    labels: [{ text: 'Fair point.', goto: null }]
  },
  7: {
    text: 'It might open a path for those who prefer to stay unseen...',
    labels: [{ text: 'I\u2019ll keep that in mind.', goto: null }]
  }
};
