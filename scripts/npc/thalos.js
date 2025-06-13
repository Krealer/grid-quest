import { startDialogueTree } from '../dialogue_system.js';
import { thalosDialogue } from '../npc_dialogues/thalos_dialogue.js';

export function interact() {
  startDialogueTree(thalosDialogue);
}
