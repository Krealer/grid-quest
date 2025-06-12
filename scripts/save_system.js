import { craftState } from './craft_state.js';

const STORAGE_KEY = 'gridquest.save';

export function saveGame() {
  const data = {
    blueprints: Array.from(craftState.unlockedBlueprints),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadGame() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.blueprints)) {
      craftState.unlockedBlueprints = new Set(data.blueprints);
      localStorage.setItem(
        'gridquest.blueprints',
        JSON.stringify(data.blueprints)
      );
      document.dispatchEvent(new CustomEvent('blueprintsLoaded'));
    }
  } catch {
    // ignore malformed saves
  }
}
