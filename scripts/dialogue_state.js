export const dialogueMemory = new Set();
export let activeDialogue = null;

export function setMemory(flag) {
  dialogueMemory.add(flag);
}

export function hasMemory(flag) {
  return dialogueMemory.has(flag);
}

export function startSession(dialogue) {
  activeDialogue = dialogue;
}

export function endSession() {
  activeDialogue = null;
}
