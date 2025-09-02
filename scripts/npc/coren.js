import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { corenDialogue } from '../../data/dialogues/coren_dialogue.js';

export function interact() {
  showDialogue('Coren', () => startDialogueTree(corenDialogue));
}
