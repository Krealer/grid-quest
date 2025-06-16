import { startDialogueTree } from '../dialogue_system.js';
import { leda } from '../dialogue/leda.js';

export function interact() {
  startDialogueTree(leda);
}
