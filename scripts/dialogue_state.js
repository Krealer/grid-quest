import { unlockBlueprint } from './craft_state.js';
import { upgradeItem, rerollEnchantment } from './forge.js';
import { addRelic } from './relic_state.js';
import { discover, discoverLore as recordLore, setForkChoice } from './player_memory.js';
import { showDialogue } from './dialogueSystem.js';
import { chooseClass as selectClass } from './class_state.js';
import { player } from './player.js';

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

export function startSession(dialogue, npcId) {
  state.activeDialogue = dialogue;
  if (npcId) discover('npcs', npcId);
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

export async function triggerReroll(id) {
  if (id) await rerollEnchantment(id);
}

// Give a relic to the player
export function giveRelic(id) {
  if (id) {
    addRelic(id);
    recordLore(id);
  }
}

// Unlock a lore entry
export function discoverLore(id) {
  if (id) recordLore(id);
}

// Set the player's class if not already chosen
export function chooseClass(id) {
  if (id && selectClass(id)) {
    player.classId = id;
  }
}

export function chooseForkPath(path) {
  if (!path) return;
  setForkChoice(path);
  if (path === 'left') {
    showDialogue('A Watcher nods from the shadows, approving your stealthy choice.');
  } else if (path === 'right') {
    showDialogue('Flamebound warriors roar in welcome as you choose the fiery road.');
  }
}
