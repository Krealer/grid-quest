import { startDialogueTree } from '../dialogue_system.js';
import { goblinQuestDialogue } from '../npc_dialogues/goblin_quest_giver.js';

export function interact() {
  startDialogueTree(goblinQuestDialogue);
}
