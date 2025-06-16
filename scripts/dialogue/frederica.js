export const frederica = {
  id: 'frederica',
  name: 'Frederica',
  portrait: '🔥',
  start: 'start',
  dialogue: {
    start: {
      text: 'frederica.dialogue.start.text',
      options: [
        { text: 'frederica.dialogue.start.0', goto: 'cave' },
        { text: 'frederica.dialogue.start.1', goto: 'leda' },
        { text: 'frederica.dialogue.start.2', goto: 'timara' },
        { text: 'frederica.dialogue.start.3', goto: 'trade_check' },
        { text: 'frederica.dialogue.start.4', goto: null }
      ]
    },

    cave: {
      text: 'frederica.dialogue.cave.text',
      options: [
        { text: 'frederica.dialogue.cave.0', goto: null }
      ]
    },

    leda: {
      text: 'frederica.dialogue.leda.text',
      options: [
        { text: 'frederica.dialogue.leda.0', goto: null }
      ]
    },

    timara: {
      text: 'frederica.dialogue.timara.text',
      options: [
        { text: 'frederica.dialogue.timara.0', goto: null }
      ]
    },

    trade_check: {
      if: {
        hasItem: { item: 'defense_potion', quantity: 3 }
      },
      then: 'trade_offer',
      else: 'trade_denied'
    },

    trade_offer: {
      text: 'frederica.dialogue.trade_offer.text',
      options: [
        {
          text: 'frederica.dialogue.trade_offer.0',
          give: { item: 'defense_potion', quantity: 3 },
          receive: { item: 'cave_pass', quantity: 1 },
          goto: 'thanks'
        },
        { text: 'frederica.dialogue.trade_offer.1', goto: null }
      ]
    },

    trade_denied: {
      text: 'frederica.dialogue.trade_denied.text',
      options: [
        { text: 'frederica.dialogue.trade_denied.0', goto: null }
      ]
    },

    thanks: {
      text: 'frederica.dialogue.thanks.text',
      options: [
        { text: 'frederica.dialogue.thanks.0', goto: null }
      ]
    }
  }
};

export default frederica;
