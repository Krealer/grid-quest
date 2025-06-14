export default [
  {
    text: "Ah, a wanderer... Looking for fortune, or answers?",
    options: [
      { label: "Fortune", goto: 1 },
      { label: "Answers", goto: 2 },
      { label: "Never mind", goto: null }
    ]
  },
  {
    text: "Riches lie in ruins, always guarded. But tell me — what will you give for a shortcut?",
    options: [
      { label: "Nothing", goto: null },
      { label: "Depends...", goto: 3 }
    ]
  },
  {
    text: "Truth is a blade. You might cut yourself on it, wanderer.",
    options: [
      { label: "I'll risk it.", goto: null }
    ]
  },
  {
    text: "Wise. Return with something rare, something dropped by those who hate the light.",
    options: [
      { label: "Got it.", goto: null }
    ]
  }
];
