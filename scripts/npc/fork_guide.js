import { startDialogueTree } from '../dialogue_system.js';
import { forkGuideDialogue } from '../npc_dialogues/fork_guide_dialogue.js';

export function interact() {
  startDialogueTree(forkGuideDialogue);
}
