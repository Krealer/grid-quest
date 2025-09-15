import { removeEnemyDropItem } from '../inventory.js';
import { loadItems } from '../item_loader.js';

const hasEnemyDrop = (state) =>
  (state.inventory['prism_fragment'] || 0) > 0 ||
  (state.inventory['goblin_ear'] || 0) > 0 ||
  (state.inventory['zombie_claw'] || 0) > 0 ||
  (state.inventory['cracked_signet'] || 0) > 0 ||
  (state.inventory['arcane_core'] || 0) > 0;

export async function createVerrelDialogue() {
  await loadItems();
  return [
    {
      text: 'A gentle voice resonates from the dim corridor. "Traveler, spare a moment?"',
      options: [
        { label: 'Who is speaking?', goto: 1 },
        { label: 'Walk away.', goto: null }
      ]
    },
    {
      text: 'I am Verrel, merely a keeper of tokens forgotten.',
      options: [
        { label: 'Tokens?', goto: 2 },
        { label: 'I have none.', goto: 3 }
      ]
    },
    {
      text: 'The shards and claws you take from foes cling to you. May I relieve you of one?',
      options: [
        { label: 'Perhaps.', goto: 4, condition: hasEnemyDrop },
        { label: 'No, I need them.', goto: 3 }
      ]
    },
    {
      text: 'Then we have little more to discuss. Farewell.',
      options: [{ label: 'Leave.', goto: null }]
    },
    {
      text: 'A single piece is all I ask. Why hold tight to grim trophies?',
      options: [
        { label: 'Why do you want it?', goto: 5 },
        {
          label: 'Fine, take one.',
          goto: 7,
          condition: hasEnemyDrop,
          onChoose: () => removeEnemyDropItem(),
          memoryFlag: 'manipulated_by_verrel'
        },
        { label: 'I refuse.', goto: 6 }
      ]
    },
    {
      text: 'To keep you from carrying the echoes of violence. Guilt is a slow poison.',
      options: [
        { label: 'Maybe you are right.', goto: 6 },
        { label: 'I doubt that.', goto: null }
      ]
    },
    {
      text: 'Consider how light you would feel, freed of just one burden.',
      options: [
        {
          label: 'Take it then.',
          goto: 7,
          condition: hasEnemyDrop,
          onChoose: () => removeEnemyDropItem(),
          memoryFlag: 'manipulated_by_verrel'
        },
        { label: 'Still no.', goto: null }
      ]
    },
    {
      text: 'Verrel accepts the item with a whisper of thanks that chills the air.',
      options: [{ label: 'Leave him behind.', goto: null }]
    }
  ];
}
