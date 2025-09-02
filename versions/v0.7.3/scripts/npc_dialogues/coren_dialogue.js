export const corenDialogue = [
  {
    text: "Halt... you're no scout of his. I'm Coren.",
    options: [
      { label: "Who is 'his'?", goto: 1 },
      { label: "Just passing through.", goto: null }
    ]
  },
  {
    text: "Our commander watches the ruins still. More relics lie ahead if you have courage to seek them.",
    options: [
      { label: "I'll keep that in mind.", goto: null, memoryFlag: 'coren_commander_hint' }
    ]
  }
];
