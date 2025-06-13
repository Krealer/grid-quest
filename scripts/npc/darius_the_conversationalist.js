import { startDialogueTree } from '../dialogue_system.js';
import { createDariusDialogue } from '../npc_dialogues/darius_the_conversationalist.js';

export async function interact() {
  const dialogue = await createDariusDialogue();
  startDialogueTree(dialogue);
}
