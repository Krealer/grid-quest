import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { corenDialogue } from '../npc_dialogues/coren_dialogue.js';

export function interact() {
  showDialogue('Coren', () => startDialogueTree(corenDialogue));
}
