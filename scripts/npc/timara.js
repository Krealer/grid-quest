import { startDialogueTree } from '../dialogue_system.js';
import { timara } from '../dialogue/timara.js';

export function interact() {
  startDialogueTree(timara);
}
