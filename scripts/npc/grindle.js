import { startDialogueTree } from '../dialogueSystem.js';
import { createGrindleDialogue } from '../npc_dialogues/grindle_dialogue.js';

export async function interact() {
  const dialogue = await createGrindleDialogue();
  startDialogueTree(dialogue);
}
