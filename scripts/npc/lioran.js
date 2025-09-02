import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { lioranDialogue } from '../../data/dialogues/lioran_dialogue.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.lioran?.displayTitle || 'Lioran';
  showDialogue(title, () => startDialogueTree(lioranDialogue));
}
