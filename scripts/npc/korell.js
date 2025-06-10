import { startDialogueTree } from '../dialogueSystem.js';
import { korellDialogue } from '../npc_dialogues/korell_dialogue.js';

export function interact() {
  startDialogueTree(korellDialogue);
}
