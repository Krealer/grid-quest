import { startDialogueTree, showDialogue } from '../dialogue_system.js';
import { npcAppearance } from '../npc_data.js';
import { loadEchoDialogue } from '../dialogue/echo_dialogue_loader.js';

export async function interact() {
  const title = npcAppearance.echo?.displayTitle || 'Echo of the Name';
  const dialogueTree = await loadEchoDialogue();
  showDialogue(title, () => startDialogueTree(dialogueTree.dialogue || dialogueTree));
}
