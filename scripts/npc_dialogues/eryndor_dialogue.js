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
      }
    ]
  }
];
