import { startDialogueTree } from '../dialogueSystem.js';
import { createForgeDialogue } from '../../data/dialogues/forge_npc.js';

export async function interact() {
  const dialogue = await createForgeDialogue();
  startDialogueTree(dialogue);
}
