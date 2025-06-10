import { startDialogueTree } from '../dialogueSystem.js';
import { krealer7Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer7Dialogue);
}
