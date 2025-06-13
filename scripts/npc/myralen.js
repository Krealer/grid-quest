import { startDialogueTree } from '../dialogue_system.js';
import { createMyralenDialogue } from '../npc_dialogues/myralen_dialogue.js';

export async function interact() {
  const dialogue = await createMyralenDialogue();
  startDialogueTree(dialogue);
}
