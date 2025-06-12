import { showDialogue } from '../dialogueSystem.js';
import { npcAppearance } from '../npc_data.js';

export function interact() {
  const title = npcAppearance.eryndor.displayTitle || 'Eryndor';
  showDialogue(`${title} nods in acknowledgement.`);
}
