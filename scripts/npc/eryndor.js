import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { npcAppearance } from '../npc_data.js';
import { eryndorDialogue } from '../../data/dialogues/eryndor_dialogue.js';

export function interact() {
  const title = npcAppearance.eryndor.displayTitle || 'Eryndor';
  showDialogue(title, () => startDialogueTree(eryndorDialogue));
}
