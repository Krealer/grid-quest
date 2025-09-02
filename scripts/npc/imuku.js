import { startDialogueTree } from '../dialogueSystem.js';
import { imukuDialogue } from '../../data/dialogues/imuku_dialogue.js';

export function interact() {
  startDialogueTree(imukuDialogue);
}

