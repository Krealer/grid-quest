import { startDialogueTree } from '../dialogue_system.js';
import { createSilariDialogue } from '../npc_dialogues/silari_the_analyst.js';

export async function interact() {
  const dialogue = await createSilariDialogue();
  startDialogueTree(dialogue);
}
