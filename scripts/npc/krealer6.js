import { startDialogueTree } from '../dialogueSystem.js';
import { krealer6Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer6Dialogue);
}
