export const lioranDialogue = [
  {
    text: state =>
      state.memory.has('lioran_met')
        ? "Ah, it's you again! I was counting raindrops."
        : "Oh! Hello there. I'm Lioran, a wandering alchemist... I think.",
    options: [
      { label: "Can you heal me?", goto: 1 },
      { label: "Who are you?", goto: 2 },
      { label: "Goodbye.", goto: null, memoryFlag: 'lioran_met' }
    ]
  },
  {
    text: "Sure thing! Just hold still while I mix... wait, was that paint?",
    options: [
      { label: "I'll drink it anyway.", goto: null },
      { label: "On second thought, no.", goto: null }
    ]
  },
  {
    text: "I'm Lioran! Or Dorlan? Names slip my mind when I'm excited.",
    options: [
      { label: "That's not reassuring.", goto: 3 },
      { label: "Farewell then.", goto: null, memoryFlag: 'lioran_met' }
    ]
  },
  {
    text: "Nonsense! Eccentric minds are often the most helpful.",
    options: [
      { label: "If you say so...", goto: null }
    ]
  }
];
