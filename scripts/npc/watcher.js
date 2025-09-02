import { startDialogueTree } from '../dialogue_system.js';
import { watcherDialogue } from '../npc_dialogues/watcher_dialogue.js';

export function interact() {
  startDialogueTree(watcherDialogue);
}
