import { startDialogueTree } from '../dialogue_system.js';
import { createForgeDialogue } from '../npc_dialogues/forge_npc.js';

export async function interact() {
  const dialogue = await createForgeDialogue();
  startDialogueTree(dialogue);
}
