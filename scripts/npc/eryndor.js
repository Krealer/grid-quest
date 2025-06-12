import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { createEryndorDialogue } from '../npc_dialogues/eryndor_dialogue.js';
import { npcAppearance } from '../npc_data.js';

export async function interact() {
  const title = npcAppearance.eryndor.displayTitle || 'Eryndor';
  const dialogue = await createEryndorDialogue();
  showDialogue(title, () => startDialogueTree(dialogue));
}
