import { startDialogueTree } from '../dialogueSystem.js';
import { createSilariDialogue } from '../../data/dialogues/silari_the_analyst.js';

export async function interact() {
  const dialogue = await createSilariDialogue();
  startDialogueTree(dialogue);
}
