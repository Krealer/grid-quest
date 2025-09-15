import { startDialogueTree } from '../dialogueSystem.js';
import { watcherDialogue } from '../npc_dialogues/watcher_dialogue.js';

export function interact() {
  startDialogueTree(watcherDialogue);
}
