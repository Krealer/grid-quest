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
