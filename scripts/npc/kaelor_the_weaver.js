import { startDialogueTree } from '../dialogueSystem.js';
import { createKaelorDialogue } from '../../data/dialogues/kaelor_the_weaver.js';

export async function interact() {
  const dialogue = await createKaelorDialogue();
  startDialogueTree(dialogue);
}
