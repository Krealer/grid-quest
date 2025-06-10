import { startDialogueTree } from '../dialogueSystem.js';
import { krealer1Dialogue } from '../dialogue_state.js';

export function interact() {
  startDialogueTree(krealer1Dialogue);
}
