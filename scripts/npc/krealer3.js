import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { krealer3Dialogue } from '../dialogue_state.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.krealer3.displayTitle || 'Krealer';
  showDialogue(title, () => startDialogueTree(krealer3Dialogue));
}
