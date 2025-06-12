export const vaelinDialogue = [
  {
    text: "So… you dealt with the commander. I felt the canyon breathe again.",
    options: [
      { label: "It wasn’t easy.", goto: 1, memoryFlag: "respected_vaelin" },
      { label: "Who are you?", goto: 2 }
    ]
  },
  {
    text: "I was a shadow under his orders. I tried to forget — but the Verge remembers.",
    options: [
      { label: "You’re free now.", goto: 3, memoryFlag: "freed_vaelin" },
      { label: "What were you guarding?", goto: 4 }
    ]
  },
  {
    text: "Freedom… perhaps. I’ve nothing left to guard.",
    options: [
      { label: "Farewell.", goto: null }
    ]
  },
  {
    text: "There’s something under the far stones. If you find it, it’s yours.",
    options: [
      {
        label: "Thank you.",
        goto: null,
        give: "faded_blade",
        condition: (state) => !state.inventory['faded_blade'],
        memoryFlag: "gifted_blade"
      }
    ]
  }
];
