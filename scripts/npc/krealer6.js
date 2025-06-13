import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { krealer6Dialogue } from '../dialogue_state.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.krealer6.displayTitle || 'Krealer';
  showDialogue(title, () => startDialogueTree(krealer6Dialogue));
}
