export const eryndorDialogue = [
  {
    text: "Greetings, seeker. The wind tells me you are not ordinary.",
    options: [
      { label: "Who are you?", goto: 1, memoryFlag: "asked_name" },
      { label: "I should go.", goto: null }
    ]
  },
  {
    text: "I am Eryndor, last of the Lorebound. My words are all that remain.",
    options: [
      { label: "Lorebound?", goto: 2 },
      { label: "Farewell.", goto: null }
    ]
  },
  {
    text: "Bound to truth, sworn to remember. Here—take this relic.",
    options: [
      {
        label: "Thank you.",
        goto: null,
        give: "ancient_scroll",
        memoryFlag: "received_scroll",
        condition: (state) => !state.inventory['ancient_scroll']
      },
      { label: "What is this place?", goto: 3 },
      { label: "What happened to your order?", goto: 4 },
      { label: "Why am I here?", goto: 5 },
      { label: "Do you fear what stirs?", goto: 6 }
    ]
  },
  {
    text: "Mist hides the path, but also preserves it. Many wander lost.",
    options: [{ label: "I see.", goto: 2 }]
  },
  {
    text: "Time and turmoil scattered the Lorebound. Only echoes remain.",
    options: [{ label: "Back.", goto: 2 }]
  },
  {
    text: "Purpose is a trail only you can walk. Seek the echoes and learn.",
    options: [{ label: "Back.", goto: 2 }]
  },
  {
    text: "Even sages feel fear. It reminds us that something ancient awakens.",
    options: [{ label: "Back.", goto: 2 }]
  }
];
