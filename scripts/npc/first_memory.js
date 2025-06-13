import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { firstMemoryDialogue } from '../npc_dialogues/first_memory_dialogue.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.first_memory.displayTitle || 'Memory';
  showDialogue(title, () => startDialogueTree(firstMemoryDialogue));
}
