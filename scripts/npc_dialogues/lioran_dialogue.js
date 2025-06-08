export const lioranDialogue = [
  {
    text: "Greetings, traveler. I am Lioran, wandering healer.",
    options: [
      { label: "Who are you?", goto: 1 },
      { label: "Any advice?", goto: 2 },
      { label: "Farewell.", goto: null }
    ]
  },
  {
    text: "Just a man seeking knowledge of the old arts.",
    options: [
      { label: "Thanks.", goto: null }
    ]
  },
  {
    text: "Keep your wits about you and watch the shadows.",
    options: [
      { label: "I'll remember that.", goto: null }
    ]
  }
];
