import { startDialogueTree } from '../dialogueSystem.js';
import { shadeSageDialogue } from '../../data/dialogues/shade_sage_dialogue.js';

export function interact() {
  startDialogueTree(shadeSageDialogue);
}
