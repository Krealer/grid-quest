import { startDialogueTree } from '../dialogueSystem.js';
import { arvalinDialogue } from '../npc_dialogues/arvalin_dialogue.js';

export function interact() {
  startDialogueTree(arvalinDialogue);
}
