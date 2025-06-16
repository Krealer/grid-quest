export const leda = {
  id: 'leda',
  name: 'Leda',
  portrait: '🪶',
  start: 'intro',
  dialogue: {
    intro: {
      text: 'leda.dialogue.intro.text',
      options: [
        { text: 'leda.dialogue.intro.0', goto: 'who' },
        { text: 'leda.dialogue.intro.1', goto: 'how' },
        { text: 'leda.dialogue.intro.2', goto: null }
      ]
    },
    who: {
      text: 'leda.dialogue.who.text',
      options: [
        { text: 'leda.dialogue.who.0', goto: 'more' },
        { text: 'leda.dialogue.who.1', goto: null }
      ]
    },
    how: {
      text: 'leda.dialogue.how.text',
      options: [
        { text: 'leda.dialogue.how.0', goto: 'more' },
        { text: 'leda.dialogue.how.1', goto: null }
      ]
    },
    more: {
      text: 'leda.dialogue.more.text',
      options: [
        { text: 'leda.dialogue.more.0', goto: null }
      ]
    }
  }
};

export default leda;
