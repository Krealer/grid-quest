import { giveItem } from '../inventory.js';
import { removeChest } from '../map.js';
import { showDialogue } from '../dialogue_system.js';

export function createOpenedChestDialogue(x, y) {
  return [
    {
      text: 'Chest is already opened',
      options: [
        {
          label: 'Cut',
          condition: (state) => (state.inventory['rusty_axe'] || 0) > 0,
          goto: null,
          onChoose: async () => {
            removeChest(x, y);
            await giveItem('wood', 1);
            showDialogue('You salvage wood from the old chest.');
          }
        },
        { label: 'Leave', goto: null }
      ]
    }
  ];
}

export default createOpenedChestDialogue;
