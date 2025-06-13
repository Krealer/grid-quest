import { startDialogueTree } from '../dialogue_system.js';
import { createArvalinDialogue } from '../npc_dialogues/arvalin_dialogue.js';

export async function interact() {
  const dialogue = await createArvalinDialogue();
  startDialogueTree(dialogue);
}
