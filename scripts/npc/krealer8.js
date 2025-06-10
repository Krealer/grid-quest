import { startDialogueTree } from '../dialogueSystem.js';
import { krealer8Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer8Dialogue);
}
