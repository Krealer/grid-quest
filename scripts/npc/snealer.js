import { startDialogueTree } from '../dialogue_system.js';
import snealerDialogue from '../dialogue/npcs/snealer.js';

export function interact() {
  startDialogueTree(snealerDialogue);
}
