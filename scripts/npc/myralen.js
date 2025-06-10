import { startDialogueTree } from '../dialogueSystem.js';
import { createMyralenDialogue } from '../npc_dialogues/myralen_dialogue.js';

export async function interact() {
  const dialogue = await createMyralenDialogue();
  startDialogueTree(dialogue);
}
