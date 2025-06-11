import { startDialogueTree } from '../dialogueSystem.js';
import { createVerrelDialogue } from '../npc_dialogues/verrel_the_voice.js';

export async function interact() {
  const dialogue = await createVerrelDialogue();
  startDialogueTree(dialogue);
}
