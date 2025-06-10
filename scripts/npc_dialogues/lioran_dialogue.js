export const lioranDialogue = [
  {
    text: "Ah! A wanderer! Or are you a whisper? Sometimes I mix them up...",
    options: [
      { label: "I’m real. I think.", goto: 1, memoryFlag: "lioran_believes_player" },
      { label: "What are you talking about?", goto: 2, memoryFlag: "lioran_confused_player" }
    ]
  },

  {
    text: "Real? Excellent! That means I can give you a warning... or was it a gift?",
    options: [
      { label: "A gift sounds better.", goto: 3 },
      { label: "I’d rather hear the warning.", goto: 4 }
    ]
  },

  {
    text: "Talking helps. Mostly. Unless it attracts them.",
    options: [
      { label: "Them?", goto: 4 },
      { label: "Goodbye, Lioran.", goto: null, memoryFlag: "lioran_dismissed" }
    ]
  },

  {
    text: "Here, take this. It might unlock... something. Or nothing at all.",
    options: [
      {
        label: "Thanks, I guess?",
        goto: null,
        give: "mysterious_token",
        memoryFlag: "lioran_gift_given",
        condition: (state) => !state.inventory['mysterious_token']
      },
      {
        label: "I don't trust strange gifts.",
        goto: null,
        memoryFlag: "lioran_refused_gift"
      }
    ]
  },

  {
    text: "They live under the floorboards. Or maybe above. Either way — mind your step!",
    options: [
      { label: "You’re not making any sense.", goto: 2 },
      { label: "I’ll be careful.", goto: null, memoryFlag: "lioran_warning_taken" }
    ]
  },
  {
    text: "I saw how you handled that scout. The commander will notice your meddling.",
    options: [
      { label: "He won't be an issue either.", goto: null },
      { label: "Why warn me?", goto: 6 }
    ],
    condition: (state) => state.memory.has('scout_defeated')
  },
  {
    text: "Because I'm hiding from them. Call me a fugitive scholar, if titles matter.",
    options: [
      { label: "Need any help?", goto: 7 },
      { label: "Stay safe, then.", goto: null }
    ]
  },
  {
    text: "Bring me any field notes you find. Knowledge deserves a keeper.",
    options: [
      { label: "I'll keep an eye out.", goto: null, memoryFlag: 'lioran_sidequest' },
      { label: "Another time.", goto: null }
    ]
  }
];

