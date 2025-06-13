import { t } from '../../i18n.js';

export default [
  {
    text: 'snealer.dialogue.1.text',
    options: [
      { label: t('snealer.dialogue.1.ask_fortune'), goto: 1 },
      { label: t('snealer.dialogue.1.ask_answers'), goto: 2 },
      { label: t('snealer.dialogue.1.leave'), goto: null }
    ]
  },
  {
    text: 'snealer.dialogue.2.text',
    options: [
      { label: t('snealer.dialogue.2.refuse'), goto: null },
      { label: t('snealer.dialogue.2.intrigued'), goto: 3 }
    ]
  },
  {
    text: 'snealer.dialogue.3.text',
    options: [
      { label: t('snealer.dialogue.3.ponder'), goto: null }
    ]
  },
  {
    text: 'snealer.dialogue.4.text',
    options: [
      { label: t('snealer.dialogue.4.nod'), goto: null }
    ]
  }
];
