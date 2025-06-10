import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { krealer2Dialogue } from '../dialogue_state.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.krealer2.displayTitle || 'Krealer';
  showDialogue(title, () => startDialogueTree(krealer2Dialogue));
}
