import { loadSettings } from './settings_manager.js';
import { inventory } from './inventory.js';
import { logMessage } from './message_log.js';

export const gameState = {
  currentMap: '',
  openedChests: new Set(),
  cutChests: new Set(),
  defeatedEnemies: new Set(),
  environment: 'clear',
  isDead: false,
  lastEnemyPos: null,
  inCombat: false,
  settings: loadSettings()
};

export function serializeGameState() {
  return {
    currentMap: gameState.currentMap,
    openedChests: Array.from(gameState.openedChests),
    cutChests: Array.from(gameState.cutChests),
    defeatedEnemies: Array.from(gameState.defeatedEnemies),
    settings: gameState.settings
  };
}

export function deserializeGameState(data) {
  if (!data) return;
  gameState.currentMap = data.currentMap || '';
  gameState.openedChests = new Set(data.openedChests || []);
  gameState.cutChests = new Set(data.cutChests || []);
  gameState.defeatedEnemies = new Set(data.defeatedEnemies || []);
  gameState.settings = data.settings || {};
}

export function saveState() {
  localStorage.setItem('gridquest.state', JSON.stringify(serializeGameState()));
}

export function loadState() {
  const json = localStorage.getItem('gridquest.state');
  if (!json) return;
  try {
    const data = JSON.parse(json);
    deserializeGameState(data);
  } catch {
    // ignore malformed data
  }
}

export function validateLoadedInventory(savedItems) {
  const expected = Array.isArray(savedItems) ? savedItems.length : 0;
  if (expected !== inventory.length) {
    logMessage('Inventory size mismatch after load');
  }
}
