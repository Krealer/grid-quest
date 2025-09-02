import { startDialogueTree } from '../dialogueSystem.js';
import { forkGuideDialogue } from '../../data/dialogues/fork_guide_dialogue.js';

export function interact() {
  startDialogueTree(forkGuideDialogue);
}
