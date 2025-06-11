const STORAGE_KEY = 'gridquest.saveData';

import {
  serializeGameState,
  deserializeGameState,
  validateLoadedInventory
} from './game_state.js';
import {
  serializeInventory,
  inventoryState
} from './inventory_state.js';
import { serializeQuestState, deserializeQuestState } from './quest_state.js';
import { serializePlayer, deserializePlayer } from './player.js';
import { refreshInventoryDisplay } from '../ui/inventory_menu.js';

export function saveGame() {
  const data = {
    game: serializeGameState(),
    inventory: serializeInventory(),
    quests: serializeQuestState(),
    player: serializePlayer()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadGame() {
  const json = localStorage.getItem(STORAGE_KEY);
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
