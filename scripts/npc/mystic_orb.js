import { startDialogueTree } from '../dialogueSystem.js';
import { mysticOrbDialogue } from '../npc_dialogues/mystic_orb_dialogue.js';

export function interact() {
  startDialogueTree(mysticOrbDialogue);
}

