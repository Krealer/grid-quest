import { startDialogueTree } from '../dialogueSystem.js';
import { krealer3Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer3Dialogue);
}
