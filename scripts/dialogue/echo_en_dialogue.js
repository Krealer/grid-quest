export default {
  id: 'echo',
  name: 'Echo of the Name',
  dialogue: [
    {
      id: 1,
      text: 'A whisper of your name echoes from the mist.',
      options: [
        { text: 'Listen', goto: 2 },
        { text: 'Ignore it', goto: null }
      ]
    },
    {
      id: 2,
      text: 'The echo speaks in tones not quite your own...',
      options: [
        { text: 'Who are you?', goto: 3 },
        { text: 'Leave', goto: null }
      ]
    },
    {
      id: 3,
      text: 'I am what remains of forgotten names. You, too, may fade.',
      options: [
        { text: 'What do you mean?', goto: null },
        { text: 'Leave', goto: null }
      ]
    }
  ]
};
