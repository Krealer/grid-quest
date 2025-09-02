import { startDialogueTree } from '../dialogueSystem.js';
import { vaelinDialogue } from '../../data/dialogues/vaelin_dialogue.js';

export function interact() {
  startDialogueTree(vaelinDialogue);
}
