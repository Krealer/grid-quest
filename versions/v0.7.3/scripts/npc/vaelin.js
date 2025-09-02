import { startDialogueTree } from '../dialogueSystem.js';
import { vaelinDialogue } from '../npc_dialogues/vaelin_dialogue.js';

export function interact() {
  startDialogueTree(vaelinDialogue);
}
