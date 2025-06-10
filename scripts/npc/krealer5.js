import { startDialogueTree } from '../dialogueSystem.js';
import { krealer5Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer5Dialogue);
}
