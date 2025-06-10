import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { firstMemoryDialogue } from '../npc_dialogues/first_memory_dialogue.js';

export function interact() {
  showDialogue('Memory Echo', () => startDialogueTree(firstMemoryDialogue));
}
