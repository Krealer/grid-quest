import { loadItems, getItemData } from '../../scripts/item_loader.js';
import { addItem } from '../../scripts/inventory.js';

export async function createMyralenDialogue() {
  await loadItems();
  return [
    {
      text: 'You stand amid unstable rifts. State your intent.',
      options: [
        { label: 'I seek power.', goto: 1 },
        { label: 'Just exploring.', goto: 2 }
      ]
    },
    {
      text: 'Power cuts both ways. This spark may aid you, if you can control it.',
      options: [
        {
          label: 'I can handle it.',
          goto: 3,
          condition: state => !state.memory.has('obtained_arcane_spark'),
          onChoose: () => {
            const data = getItemData('arcane_spark') || {
              name: 'Arcane Spark',
              description: ''
            };
            addItem({ ...data, id: 'arcane_spark', quantity: 1 });
          },
          memoryFlag: 'obtained_arcane_spark'
        },
        { label: 'Maybe later.', goto: null }
      ]
    },
    {
      text: 'Observation only. Do not tamper further.',
      options: [ { label: 'Understood.', goto: null } ]
    },
    {
      text: 'Use it wisely. The burst will strike all who oppose you.',
      options: [ { label: 'Thank you.', goto: null } ]
    }
  ];
}
