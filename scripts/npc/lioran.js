import { startDialogueTree } from '../dialogueSystem.js';
import { lioranDialogue } from '../npc_dialogues/lioran_dialogue.js';

export function interact() {
  startDialogueTree(lioranDialogue);
}
