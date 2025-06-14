import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { loadSnealerDialogue } from '../npc_dialogues/snealer_dialogue_loader.js';

export async function interact() {
  const dialogueTree = await loadSnealerDialogue();
  showDialogue('snealer.intro', () => startDialogueTree(dialogueTree));
}
