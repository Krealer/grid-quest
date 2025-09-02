import { startDialogueTree } from '../dialogueSystem.js';
import { syranelDialogue } from '../../data/dialogues/syranel_dialogue.js';

export function interact() {
  startDialogueTree(syranelDialogue);
}
