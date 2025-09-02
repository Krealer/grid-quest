import { loadSettings } from './settings_manager.js';
import { inventory } from './inventory.js';

export const gameState = {
  currentMap: '',
  openedChests: new Set(),
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
    defeatedEnemies: Array.from(gameState.defeatedEnemies),
    settings: gameState.settings
  };
}

export function deserializeGameState(data) {
  if (!data) return;
  gameState.currentMap = data.currentMap || '';
  gameState.openedChests = new Set(data.openedChests || []);
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
    console.warn('Inventory size mismatch after load');
  }
}
