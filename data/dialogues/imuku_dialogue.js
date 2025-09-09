export const imukuDialogue = [
  {
    text: 'Hey friend, Imuku here. Curious about the world around you?',
    options: [
      { label: 'What are blue tiles?', goto: 1 },
      { label: 'What are white tiles?', goto: 2 },
      { label: 'What are red triangles?', goto: 3 },
      { label: 'Nothing for now.', goto: null }
    ]
  },
  {
    text: 'Blue tiles are water. Interact with them and your health will be restored.',
    options: [{ label: 'Thanks, Imuku.', goto: null }]
  },
  {
    text: 'White tiles mark doors. Interact with one to travel to a different map.',
    options: [{ label: 'Got it.', goto: null }]
  },
  {
    text: 'Red triangles are enemies. Touch one and you\'ll be pulled into battle.',
    options: [{ label: 'I\'m ready.', goto: null }]
  }
];

