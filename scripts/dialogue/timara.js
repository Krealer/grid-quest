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
        { text: 'timara.dialogue.start.1', goto: 'gem_info' },
        { text: 'timara.dialogue.start.2', goto: null }
      ]
    },

    ronington: {
      text: 'timara.dialogue.ronington.text',
      options: [
        { text: 'timara.dialogue.ronington.0', goto: null }
      ]
    },

    gem_info: {
      text: 'timara.dialogue.gem_info.text',
      options: [
        {
          if: {
            hasItem: { item: 'gem', quantity: 1 }
          },
          text: 'timara.dialogue.gem_offer',
          give: { item: 'gem', quantity: 1 },
          receive: { item: 'rusty_axe', quantity: 1 },
          goto: 'gem_receive'
        },
        { text: 'timara.dialogue.gem_info.0', goto: null }
      ]
    },

    gem_receive: {
      text: 'timara.dialogue.gem_receive',
      options: [
        { text: 'timara.dialogue.thank_you.0', goto: null }
      ]
    }
  }
};

export default timara;
