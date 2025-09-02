import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { krealer4Dialogue } from '../dialogue_state.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.krealer4.displayTitle || 'Krealer';
  showDialogue(title, () => startDialogueTree(krealer4Dialogue));
}
