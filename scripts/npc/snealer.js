export const snealer = {
  id: 'snealer',
  name: 'Snealer',
  description: 'A cloaked figure with a sly grin and watchful eyes.',
  style: 'advanced',
  portrait: '⚪', // Advanced NPC (white circle)
  dialogue: {
    start: {
      text: 'Psst... not all treasures are in chests, you know.',
      options: [
        { text: 'What do you mean?', next: 'hint' },
        { text: 'I\u2019m not interested.', next: null }
      ]
    },
    hint: {
      text: 'Some secrets lie where footsteps vanish...'
    }
  }
};

export default snealer;
