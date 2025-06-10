import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { eryndorDialogue } from '../npc_dialogues/eryndor_dialogue.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.eryndor.displayTitle || 'Eryndor';
  showDialogue(title, () => startDialogueTree(eryndorDialogue));
}
