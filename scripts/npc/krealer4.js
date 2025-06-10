import { startDialogueTree } from '../dialogueSystem.js';
import { krealer4Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer4Dialogue);
}
