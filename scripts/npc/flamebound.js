import { startDialogueTree } from '../dialogueSystem.js';
import { flameboundDialogue } from '../../data/dialogues/flamebound_dialogue.js';

export function interact() {
  startDialogueTree(flameboundDialogue);
}
