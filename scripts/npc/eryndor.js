import { startDialogueTree } from '../dialogueSystem.js';
import { eryndorDialogue } from '../npc_dialogues/eryndor_dialogue.js';

export function interact() {
  startDialogueTree(eryndorDialogue);
}
