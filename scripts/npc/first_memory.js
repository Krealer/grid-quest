import { startDialogueTree, showDialogue } from '../dialogueSystem.js';
import { firstMemoryDialogue } from '../../data/dialogues/first_memory_dialogue.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.first_memory.displayTitle || 'Memory';
  showDialogue(title, () => startDialogueTree(firstMemoryDialogue));
}
