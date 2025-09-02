import { startDialogueTree } from '../dialogue_system.js';
import { createKaelorDialogue } from '../npc_dialogues/kaelor_the_weaver.js';

export async function interact() {
  const dialogue = await createKaelorDialogue();
  startDialogueTree(dialogue);
}
