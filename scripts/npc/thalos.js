import { startDialogueTree } from '../dialogueSystem.js';
import { thalosDialogue } from '../../data/dialogues/thalos_dialogue.js';

export function interact() {
  startDialogueTree(thalosDialogue);
}
