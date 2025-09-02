import { startQuest } from '../../scripts/quest_state.js';
import { removeItem, addItem } from '../../scripts/inventory.js';
import { loadItems, getItemData } from '../../scripts/item_loader.js';

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
    text: "Have you brought the goblin gear I asked for?",
    options: [
      {
        label: "Yes, here it is.",
        goto: 2,
        condition: (state) => (state.inventory['goblin_gear'] || 0) >= 5,
        onChoose: async () => {
          await loadItems();
          const data = getItemData('goblin_sword') || { name: 'Goblin Sword', description: '' };
          removeItem('goblin_gear', 5);
          addItem({ ...data, id: 'goblin_sword', quantity: 1 });
        },
        completeQuest: 'goblin_gear'
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
        memoryFlag: "goblin_quest_completed"
      }
    ]
  }
];
