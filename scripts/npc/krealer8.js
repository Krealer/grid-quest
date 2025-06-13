import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { krealer8Dialogue } from '../dialogue_state.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.krealer8.displayTitle || 'Krealer';
  showDialogue(title, () => startDialogueTree(krealer8Dialogue));
}
