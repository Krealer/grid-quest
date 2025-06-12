export async function createSilariDialogue() {
  return [
    {
      text: 'Silari traces symbols in the dust, waiting for your question.',
      options: [
        { label: 'What are Echoes?', goto: 1 },
        { label: 'What do people do with an old coin?', goto: 3 },
        { label: 'Why do doors lock in this world?', goto: 5 },
        { label: 'What\u2019s the difference between a trap and a test?', goto: 7 },
        { label: 'What happens if you lose too many memories?', goto: 9 },
        { label: 'Maybe later.', goto: null }
      ]
    },
    {
      text: 'Echoes are the maze remembering itself.',
      options: [ { label: 'And us?', goto: 2 } ]
    },
    {
      text: 'We add new notes to its endless song.',
      options: [ { label: 'I see.', goto: null, memoryFlag: 'asked_echoes' } ]
    },
    {
      text: 'Old coins buy stories. Some trade them for guidance, some for luck.',
      options: [ { label: 'Does it work?', goto: 4 } ]
    },
    {
      text: 'Only if belief is strong; otherwise they remain metal.',
      options: [ { label: 'Thank you.', goto: null, memoryFlag: 'asked_coin' } ]
    },
    {
      text: 'Doors lock to give shape to our wanderings.',
      options: [ { label: 'Who locks them?', goto: 6 } ]
    },
    {
      text: 'Perhaps the architects, perhaps our fears.',
      options: [ { label: 'Makes sense.', goto: null, memoryFlag: 'asked_doors' } ]
    },
    {
      text: 'A trap condemns, a test prepares.',
      options: [ { label: 'So this maze is?', goto: 8 } ]
    },
    {
      text: 'Both, if we listen to the lessons.',
      options: [ { label: 'Understood.', goto: null, memoryFlag: 'asked_trap' } ]
    },
    {
      text: 'Lose too many memories and you fade into an Echo.',
      options: [ { label: 'Can they return?', goto: 10 } ]
    },
    {
      text: 'Sometimes. Echoes hold what we misplace.',
      options: [ { label: 'Farewell.', goto: null, memoryFlag: 'asked_memories' } ]
    }
  ];
}
