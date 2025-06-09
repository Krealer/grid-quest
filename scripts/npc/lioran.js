import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { lioranDialogue } from '../npc_dialogues/lioran_dialogue.js';

export function interact() {
  // Display Lioran's name before beginning the dialogue tree
  showDialogue('Lioran', () => startDialogueTree(lioranDialogue));
}
