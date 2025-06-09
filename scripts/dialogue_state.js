import { unlockBlueprint } from './craft_state.js';
import { upgradeItem } from './forge.js';

export const dialogueMemory = new Set();

const state = {
  activeDialogue: null,
};

export function getActiveDialogue() {
  return state.activeDialogue;
}

export function setMemory(flag) {
  dialogueMemory.add(flag);
}

export function hasMemory(flag) {
  return dialogueMemory.has(flag);
}

export function startSession(dialogue) {
  state.activeDialogue = dialogue;
}

export function endSession() {
  state.activeDialogue = null;
}

export const dialogueState = state;

// Allow dialogue options to grant blueprints as rewards
export function giveBlueprint(id) {
  if (id) unlockBlueprint(id);
}

export async function triggerUpgrade(id) {
  if (id) await upgradeItem(id);
}
