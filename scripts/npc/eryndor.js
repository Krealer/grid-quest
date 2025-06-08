import { showDialogue } from '../dialogueSystem.js';
import { dialogue } from '../npc_dialogues/eryndor_dialogue.js';

export function interact() {
  showDialogue(dialogue.intro);
}
