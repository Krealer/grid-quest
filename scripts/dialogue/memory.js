import { discover, setKrealerFlag } from '../player_memory.js';

export const dialogueMemory = new Set();
export const dialogueBranches = {};

const state = {
  activeDialogue: null
};

export const dialogueState = state;

export function getActiveDialogue() {
  return state.activeDialogue;
}

export function setMemory(flag) {
  dialogueMemory.add(flag);
  if (flag && flag.startsWith('flag_krealer')) setKrealerFlag(flag);
  document.dispatchEvent(new CustomEvent('memoryFlagSet', { detail: flag }));
}

export function hasMemory(flag) {
  return dialogueMemory.has(flag);
}

export function setBranchChoice(id, choice) {
  if (!id) return;
  dialogueBranches[id] = choice;
}

export function getBranchChoice(id) {
  return dialogueBranches[id];
}

export function startSession(dialogue, npcId) {
  state.activeDialogue = dialogue;
  if (npcId) discover('npcs', npcId);
}

export function endSession() {
  state.activeDialogue = null;
}
