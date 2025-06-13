import { startDialogueTree } from '../dialogue_system.js';
import { flameboundDialogue } from '../npc_dialogues/flamebound_dialogue.js';

export function interact() {
  startDialogueTree(flameboundDialogue);
}
