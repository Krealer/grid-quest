import { startDialogueTree } from '../dialogueSystem.js';
import { syranelDialogue } from '../npc_dialogues/syranel_dialogue.js';

export function interact() {
  startDialogueTree(syranelDialogue);
}
