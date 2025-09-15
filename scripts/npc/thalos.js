import { startDialogueTree } from '../dialogueSystem.js';
import { thalosDialogue } from '../npc_dialogues/thalos_dialogue.js';

export function interact() {
  startDialogueTree(thalosDialogue);
}
