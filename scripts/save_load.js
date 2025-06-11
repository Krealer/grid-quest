const STORAGE_PREFIX = 'game_save_slot_';

import {
  serializeGameState,
  deserializeGameState,
  validateLoadedInventory
} from './game_state.js';
import { serializeInventory, inventoryState } from './inventory_state.js';
import { serializeQuestState, deserializeQuestState } from './quest_state.js';
import { serializePlayer, deserializePlayer } from './player.js';
import { refreshInventoryDisplay } from '../ui/inventory_menu.js';

import { gameState } from './game_state.js';

export function saveGame(slot = 1) {
  const data = {
    timestamp: Date.now(),
    game: serializeGameState(),
    inventory: serializeInventory(),
    quests: serializeQuestState(),
    player: serializePlayer()
  };
  const key = `${STORAGE_PREFIX}${slot}`;
  localStorage.setItem(key, JSON.stringify(data));
  if (slot === 2) {
    console.log('Saved to Slot 2:', gameState);
  }
}

export function loadGame(slot = 1) {
  const key = `${STORAGE_PREFIX}${slot}`;
  const json = localStorage.getItem(key);
  if (!json) return false;
  try {
    const data = JSON.parse(json);
    deserializeGameState(data.game || {});
    inventoryState.loadFromObject(data.inventory || {});
    refreshInventoryDisplay();
    validateLoadedInventory(data.inventory?.items || []);
    deserializeQuestState(data.quests || {});
    deserializePlayer(data.player || {});
    return true;
  } catch (err) {
    console.error('Failed to load save', err);
    return false;
  }
}
