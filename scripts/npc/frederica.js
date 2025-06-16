import { startDialogueTree } from '../dialogue_system.js';
import { frederica } from '../dialogue/frederica.js';

export function interact() {
  startDialogueTree(frederica);
}
