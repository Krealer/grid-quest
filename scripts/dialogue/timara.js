import { removeItem, hasItem, giveItem } from '../inventory.js';

export const timara = {
  id: 'timara',
  name: 'Timara',
  portrait: '🛠️',
  start: 'start',
  dialogue: {
    start: {
      text: 'timara.dialogue.start.text',
      options: [
        { text: 'timara.dialogue.start.0', goto: 'ronington' },
        { text: 'timara.dialogue.start.1', goto: 'gem_trade' },
        { text: 'timara.dialogue.start.2', goto: null }
      ]
    },

    ronington: {
      text: 'timara.dialogue.ronington.text',
      options: [{ text: 'timara.dialogue.ronington.0', goto: null }]
    },

    gem_trade: {
      text: 'timara.dialogue.gem_trade.text',
      options: [
        {
          condition: (state) =>
            (state.inventory['gem'] || 0) > 0 &&
            (state.inventory['rusty_axe'] || 0) === 0,
          text: 'timara.dialogue.gem_trade.give',
          onChoose: async () => {
            removeItem('gem', 1);
            if (!hasItem('rusty_axe')) await giveItem('rusty_axe', 1);
          },
          goto: 'after_trade'
        },
        { text: 'timara.dialogue.gem_trade.leave', goto: null }
      ]
    },

    after_trade: {
      text: 'timara.dialogue.after_trade.text',
      options: [{ text: 'timara.dialogue.thank_you.0', goto: null }]
    }
  }
};

export default timara;
