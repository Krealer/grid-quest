import { startQuest, completeQuest } from '../quest_state.js';
import { removeItem, addItem } from '../inventory.js';
import { loadItems, getItemData } from '../item_loader.js';

export const goblinQuestDialogue = [
  {
    text: "If you bring me goblin gear, I might give you something in return...",
    options: [
      {
        label: "I'll see what I can do.",
        goto: null,
        memoryFlag: "quest_goblin_started",
        onChoose: () => startQuest('goblin_gear')
      }
    ]
  },
  {
    text: "Have you managed to get some goblin gear?",
    options: [
      {
        label: "Yes, here it is.",
        goto: 2,
        condition: (state) => (state.inventory['goblin_ear'] || 0) >= 3,
        onChoose: async () => {
          await loadItems();
          const data = getItemData('silver_key') || { name: 'Silver Key', description: '' };
          removeItem('goblin_ear', 3);
          addItem({ ...data, id: 'silver_key', quantity: 1 });
          completeQuest('goblin_gear');
        }
      },
      {
        label: "Not yet.",
        goto: null
      }
    ]
  },
  {
    text: "Impressive. Here's something useful in return.",
    options: [
      {
        label: "Thank you.",
        goto: null,
        memoryFlag: "quest_goblin_completed"
      }
    ]
  }
];
