export const thalosDialogue = [
  {
    text: 'Thalos peers into the rift, eyes unfocused.',
    options: [
      { label: 'What do you see?', goto: 1, memoryFlag: 'spoken_with_thalos' },
      { label: 'Leave', goto: null }
    ]
  },
  {
    text: '"Echoes twist and fade. Their meanings slip between worlds."',
    options: [
      {
        label: 'Show rift fragment.',
        goto: 2,
        condition: state => state.inventory['rift_fragment'] >= 1
      },
      { label: 'I see.', goto: null }
    ]
  },
  {
    text: '"A shard of the rift itself... Perhaps it seeks reunion."',
    options: [
      { label: 'Interesting.', goto: null }
    ]
  }
];
