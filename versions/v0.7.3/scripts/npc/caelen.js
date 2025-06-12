import { startDialogueTree } from '../dialogueSystem.js';
import { caelenDialogue } from '../npc_dialogues/caelen_dialogue.js';

export function interact() {
  startDialogueTree(caelenDialogue);
}
