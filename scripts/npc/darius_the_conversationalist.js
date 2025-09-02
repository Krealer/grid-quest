import { startDialogueTree } from '../dialogueSystem.js';
import { createDariusDialogue } from '../../data/dialogues/darius_the_conversationalist.js';

export async function interact() {
  const dialogue = await createDariusDialogue();
  startDialogueTree(dialogue);
}
