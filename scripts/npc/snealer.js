import { startDialogueTree } from '../dialogueSystem.js';
import snealerDialogue from '../dialogue/npcs/snealer.js';

export function interact() {
  startDialogueTree(snealerDialogue);
}
