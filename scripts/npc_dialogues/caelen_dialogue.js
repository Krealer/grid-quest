import { removeItem, addItem } from '../inventory.js';
import { loadItems, getItemData } from '../item_loader.js';

export const caelenDialogue = [
  {
    text: 'Traveler, the mirrored gate needs a special key. Do you seek it?',
    options: [
      { label: 'What key?', goto: 1 },
      { label: 'Just passing by.', goto: null }
    ]
  },
  {
    text: 'I can part with the prism key, but magic calls for magic. Bring me a mana scroll.',
    options: [
      {
        label: 'Trade mana scroll.',
        goto: 2,
        condition: state => (state.inventory['mana_scroll'] || 0) >= 1,
        onChoose: async () => {
          await loadItems();
          const data = getItemData('prism_key') || { name: 'Prism Key', description: '' };
          removeItem('mana_scroll', 1);
          addItem({ ...data, id: 'prism_key', quantity: 1 });
        },
        memoryFlag: 'traded_for_prism_key'
      },
      { label: 'Not right now.', goto: null }
    ]
  },
  {
    text: 'Use it wisely. The door ahead will open with this prism key.',
    options: [ { label: 'Thank you.', goto: null } ]
  }
];
