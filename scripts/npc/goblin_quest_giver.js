import { startDialogueTree } from '../dialogueSystem.js';
import { goblinQuestDialogue } from '../../data/dialogues/goblin_quest_giver.js';

export function interact() {
  startDialogueTree(goblinQuestDialogue);
}
