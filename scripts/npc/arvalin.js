import { startDialogueTree } from '../dialogueSystem.js';
import { createArvalinDialogue } from '../../data/dialogues/arvalin_dialogue.js';

export async function interact() {
  const dialogue = await createArvalinDialogue();
  startDialogueTree(dialogue);
}
