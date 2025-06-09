import { startDialogueTree } from '../dialogueSystem.js';
import { flameboundDialogue } from '../npc_dialogues/flamebound_dialogue.js';

export function interact() {
  startDialogueTree(flameboundDialogue);
}
