import { loadItems } from '../item_loader.js';

export async function createDariusDialogue() {
  await loadItems();
  return [
    {
      text: 'Greetings, traveler! Care to spare a moment for conversation?',
      options: [
        { label: 'Who are you?', goto: 1 },
        { label: 'How do I leave this maze?', goto: 4 },
        { label: 'Share some wisdom.', goto: 6 },
        { label: 'Do you have supplies?', goto: 8 },
        { label: 'Tell me a story.', goto: 10 },
        { label: 'I need help in battle.', goto: 12 },
        { label: 'Maybe another time.', goto: null }
      ]
    },
    {
      text: "I'm Darius, once a wanderer, now a listener to echoes.",
      options: [
        { label: 'Sounds interesting.', goto: 2 },
        { label: 'Good to meet you.', goto: null }
      ]
    },
    {
      text: 'In traveling these halls I found a shard that sharpens focus.',
      options: [
        { label: 'Any chance I could use it?', goto: 3 },
        { label: 'Keep it safe.', goto: null }
      ]
    },
    {
      text: 'Certainly. May it clear your mind when danger strikes.',
      options: [
        {
          label: 'Accept the shard',
          goto: null,
          give: 'clarity_shard',
          condition: state => !state.memory.has('darius_clarity_given'),
          memoryFlag: 'darius_clarity_given'
        },
        { label: 'No thank you.', goto: null }
      ]
    },
    {
      text: 'Paths twist upon themselves. Keep your left hand to the wall and you will circle back here.',
      options: [
        { label: 'Appreciate it.', goto: 5 },
        { label: 'Why stay here?', goto: 5 }
      ]
    },
    {
      text: 'I stay because new faces bring new thoughts. That is enough for now.',
      options: [ { label: 'I see.', goto: null } ]
    },
    {
      text: 'Wisdom? Hmm. Listening is the first step to understanding.',
      options: [
        { label: 'Go on.', goto: 7 },
        { label: 'I will remember that.', goto: null }
      ]
    },
    {
      text: 'And understanding is but a doorway to more questions.',
      options: [ { label: 'Thought provoking.', goto: null } ]
    },
    {
      text: 'Supplies are scarce, but I do have something gentle for weary bones.',
      options: [
        { label: 'A small drink would help.', goto: 9 },
        { label: 'Save it for later.', goto: null }
      ]
    },
    {
      text: 'Here, this flask should ease your travels.',
      options: [
        {
          label: 'Thank you.',
          goto: null,
          give: 'gentle_flask',
          condition: state => !state.memory.has('darius_flask_given'),
          memoryFlag: 'darius_flask_given'
        },
        { label: 'I actually do not need it.', goto: null }
      ]
    },
    {
      text: 'Very well. Let me recount a brief tale of dreams within dreams.',
      options: [
        { label: 'Listen closely.', goto: 11 },
        { label: 'Another time.', goto: null }
      ]
    },
    {
      text: 'The story ends without an answer, leaving only reflection.',
      options: [ { label: 'Interesting.', goto: null } ]
    },
    {
      text: 'For battle, natural remedies often serve best.',
      options: [
        { label: 'Do you have one to spare?', goto: 13 },
        { label: 'I will manage.', goto: null }
      ]
    },
    {
      text: 'Take this dreamleaf. Mix it later with herbs for potent brews.',
      options: [
        {
          label: 'Accept the leaf',
          goto: null,
          give: 'dreamleaf',
          condition: state => !state.memory.has('darius_leaf_given'),
          memoryFlag: 'darius_leaf_given'
        },
        { label: 'Maybe later.', goto: null }
      ]
    }
  ];
}
