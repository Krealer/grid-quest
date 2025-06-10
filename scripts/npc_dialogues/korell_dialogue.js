import { removeItem, addItem } from '../inventory.js';
import { loadItems, getItemData } from '../item_loader.js';
import { unlockBlueprint, unlockFusion } from '../craft_state.js';

export const korellDialogue = [
  {
    text: "Hmm. You're not dead. Good. Means I can teach you something.",
    options: [
      { label: 'Teach me?', goto: 1 },
      { label: 'Who are you?', goto: 2 }
    ]
  },
  {
    text: 'Fusion. Not magic. Not science. Just stubborn material honesty.',
    options: [{ label: "I'm listening.", goto: 3 }]
  },
  {
    text: 'Give me a badge from that commander. I’ll trade it for a recipe.',
    options: [
      {
        label: 'Here’s the commander’s badge.',
        goto: 4,
        condition: (state) => state.inventory['commander_badge'] >= 1,
        onChoose: async () => {
          await loadItems();
          const bp = getItemData('blueprint_health_amulet') || {
            name: 'Blueprint: Health Amulet',
            description: ''
          };
          removeItem('commander_badge', 1);
          addItem({ ...bp, id: 'blueprint_health_amulet', quantity: 1 });
          unlockBlueprint('health_amulet');
          unlockFusion();
        },
        memoryFlag: 'learned_health_amulet'
      },
      { label: 'I’ll come back later.', goto: null }
    ]
  },
  {
    text: 'Hmm… blueprint’s yours. Use it well. Waste it, and I’ll never forgive you.',
    options: [{ label: 'Got it.', goto: null }]
  }
];
