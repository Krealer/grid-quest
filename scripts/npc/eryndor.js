import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { npcAppearance } from '../npc_data.js';
import { loadEryndorDialogue } from '../npc_dialogues/eryndor_dialogue_loader.js';

export async function interact() {
  const title = npcAppearance.eryndor.displayTitle || 'Eryndor';
  const dialogueTree = await loadEryndorDialogue();
  showDialogue(title, () => startDialogueTree(dialogueTree));
}
