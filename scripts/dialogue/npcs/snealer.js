export default [
  {
    text: 'Psst... not all treasures are in chests, you know.',
    options: [
      { label: 'What do you mean?', goto: 1 },
      { label: 'You look suspicious.', goto: 2 },
      { label: "I'll be going.", goto: null }
    ]
  },
  {
    text: 'Some secrets lie where footsteps vanish...',
    options: [
      { label: 'Where should I look?', goto: 3 },
      { label: 'Sounds like nonsense.', goto: null }
    ]
  },
  {
    text: "Suspicious? Me? I'm just a humble observer of the unseen.",
    options: [
      { label: 'Observer of what exactly?', goto: 4 },
      { label: 'Still sounds suspicious.', goto: null }
    ]
  },
  {
    text: "If you can answer this: What walks without a sound, and lives only when no one's around?",
    options: [
      { label: 'A shadow?', goto: 5 },
      { label: 'A ghost?', goto: 6 },
      { label: 'No idea.', goto: null }
    ]
  },
  {
    text: 'The sort of things that disappear when light hits them...',
    options: [{ label: 'Interesting.', goto: null }]
  },
  {
    text: "Sharp. I wasn't sure you had it in you.",
    options: [
      { label: 'What is this token?', goto: 7, give: 'shadow_token' },
      { label: 'Thanks.', goto: null, give: 'shadow_token' }
    ]
  },
  {
    text: "Heh. Close, but shadows don't haunt.",
    options: [{ label: 'Fair point.', goto: null }]
  },
  {
    text: 'It might open a path for those who prefer to stay unseen...',
    options: [{ label: "I'll keep that in mind.", goto: null }]
  }
];
