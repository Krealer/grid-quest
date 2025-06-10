import { startDialogueTree } from '../dialogueSystem.js';
import { krealer2Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer2Dialogue);
}
