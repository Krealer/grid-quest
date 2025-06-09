import { startQuest } from '../quest_state.js';
import { removeItem, addItem } from '../inventory.js';
import { loadItems, getItemData } from '../item_loader.js';
import { unlockRecipe, isRecipeUnlocked } from '../recipe_state.js';

export async function createArvalinDialogue() {
  await loadItems();
  return [
    {
      text: "The Scout dropped something cursed. Bring me 1 goblin insignia and 1 cracked helmet.",
      options: [
        {
          label: "I'll find them.",
          goto: null,
          memoryFlag: 'arvalin_quest_started',
          onChoose: () => startQuest('purify_token')
        },
        { label: 'Maybe later.', goto: null }
      ]
    },
    {
      text: "Do you have the items I asked for?",
      options: [
        {
          label: 'Yes, take them.',
          goto: 2,
          condition: state => state.inventory['goblin_insignia'] >= 1 && state.inventory['cracked_helmet'] >= 1,
          onChoose: async () => {
            const data = getItemData('purified_token') || { name: 'Purified Token', description: '' };
            removeItem('goblin_insignia', 1);
            removeItem('cracked_helmet', 1);
            addItem({ ...data, id: 'purified_token', quantity: 1 });
          },
          completeQuest: 'purify_token'
        },
        { label: 'Not yet.', goto: null }
      ]
    },
    {
      text: 'Excellent. The curse is lifted. Take this token.',
      options: [
        { label: 'Thank you.', goto: null, memoryFlag: 'arvalin_quest_complete' }
      ]
    },
    {
      text: 'I can teach you a recipe if you have proof of valor.',
      options: [
        {
          label: 'Trade commander badge.',
          goto: null,
          condition: state => state.inventory['commander_badge'] >= 1 && !isRecipeUnlocked('health_amulet'),
          onChoose: async () => {
            const bp = getItemData('blueprint_amulet') || { name: 'Blueprint: Amulet', description: '' };
            removeItem('commander_badge', 1);
            addItem({ ...bp, id: 'blueprint_amulet', quantity: 1 });
            unlockRecipe('health_amulet');
          }
        },
        { label: 'Maybe later.', goto: null }
      ]
    }
  ];
}
