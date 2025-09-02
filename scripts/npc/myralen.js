import { startDialogueTree } from '../dialogueSystem.js';
import { createMyralenDialogue } from '../../data/dialogues/myralen_dialogue.js';

export async function interact() {
  const dialogue = await createMyralenDialogue();
  startDialogueTree(dialogue);
}
