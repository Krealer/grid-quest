import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import snealerDialogue from '../dialogue/npcs/snealer.js';

export function interact() {
  showDialogue('snealer.intro', () => startDialogueTree(snealerDialogue));
}
