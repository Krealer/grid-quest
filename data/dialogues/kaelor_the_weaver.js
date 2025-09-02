import { removePrismFragments, addItem } from '../../scripts/inventory.js';
import { loadItems, getItemData } from '../../scripts/item_loader.js';

export async function createKaelorDialogue() {
  await loadItems();
  return [
    {
      text: 'Need the last key? Ten prism fragments. No haggling.',
      options: [
        {
          label: 'Trade fragments.',
          goto: 1,
          condition: state =>
            (state.inventory['prism_fragment'] || 0) >= 10 &&
            !state.memory.has('traded_with_kaelor'),
          onChoose: () => {
            const data = getItemData('maze_key_2') || {
              name: 'Maze Key 2',
              description: ''
            };
            removePrismFragments(10);
            addItem({ ...data, id: 'maze_key_2', quantity: 1 });
          },
          memoryFlag: 'traded_with_kaelor'
        },
        { label: 'Maybe later.', goto: null }
      ]
    },
    {
      text: 'Deal done. That key opens the north gate.',
      options: [{ label: 'Understood.', goto: null }]
    }
  ];
}
