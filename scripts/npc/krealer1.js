import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { krealer1Dialogue } from '../dialogue_state.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.krealer1.displayTitle || 'Krealer';
  showDialogue(title, () => startDialogueTree(krealer1Dialogue));
}
