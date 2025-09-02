import { startDialogueTree } from '../dialogueSystem.js';
import { watcherDialogue } from '../../data/dialogues/watcher_dialogue.js';

export function interact() {
  startDialogueTree(watcherDialogue);
}
