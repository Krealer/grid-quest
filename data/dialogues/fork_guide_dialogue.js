export const forkGuideDialogue = [
  {
    text: "Two paths diverge ahead. Each will shape your fate.",
    options: [
      { label: "Tell me of the left path.", goto: 1 },
      { label: "Tell me of the right path.", goto: 2 },
      { label: "I'm ready to choose.", goto: 3 }
    ]
  },
  {
    text: "The left road winds through ancient stone ruins guarded by creatures of earth.",
    options: [ { label: "Back", goto: 0 } ]
  },
  {
    text: "The right road descends into haunted woods where phantoms lurk.",
    options: [ { label: "Back", goto: 0 } ]
  },
  {
    text: "Which way calls to you?",
    options: [
      { label: "I walk the left path.", goto: null, onChoose: () => import('../../scripts/dialogue_state.js').then(m => m.chooseForkPath('left')) },
      { label: "I walk the right path.", goto: null, onChoose: () => import('../../scripts/dialogue_state.js').then(m => m.chooseForkPath('right')) }
    ]
  }
];
