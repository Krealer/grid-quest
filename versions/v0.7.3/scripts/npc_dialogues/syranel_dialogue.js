import { startQuest, completeQuest } from '../quest_state.js';
import { removeItem } from '../inventory.js';
import { loadItems } from '../item_loader.js';

export const syranelDialogue = [
  {
    text: '"You have seen them rot… and rise. Bring me the still-oozing heart of one, and I shall teach you a darker art."',
    options: [
      {
        label: "I'll return with it.",
        goto: null,
        memoryFlag: 'syranel_request',
        onChoose: () => startQuest('crimson_request')
      },
      {
        label: 'Offer the rotting heart.',
        goto: 2,
        condition: state => state.inventory['rotting_heart'] >= 1,
        onChoose: async () => {
          await loadItems();
          removeItem('rotting_heart', 1);
          const m = await import('../player.js');
          m.grantSkill('leech');
        },
        completeQuest: 'crimson_request',
        memoryFlag: 'learned_leech'
      }
    ]
  },
  {
    text: '"Have you brought the rotting heart?"',
    options: [
      {
        label: 'Yes, take it.',
        goto: 2,
        condition: state => state.inventory['rotting_heart'] >= 1,
        onChoose: async () => {
          await loadItems();
          removeItem('rotting_heart', 1);
          const m = await import('../player.js');
          m.grantSkill('leech');
        },
        completeQuest: 'crimson_request',
        memoryFlag: 'learned_leech'
      },
      { label: 'Not yet.', goto: null }
    ]
  },
  {
    text: '"Blood answers to blood. You now know its rhythm."',
    options: [
      { label: 'Leave', goto: null }
    ]
  }
];
