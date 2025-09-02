import { startDialogueTree } from '../dialogue_system.js';
import { caelenDialogue } from '../npc_dialogues/caelen_dialogue.js';

export function interact() {
  startDialogueTree(caelenDialogue);
}
