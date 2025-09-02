import { startDialogueTree } from '../dialogueSystem.js';
import { caelenDialogue } from '../../data/dialogues/caelen_dialogue.js';

export function interact() {
  startDialogueTree(caelenDialogue);
}
