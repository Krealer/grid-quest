import { saveState, loadState, gameState } from './game_state.js';
import { saveGame, loadGame } from './save_load.js';
import { initFog, reveal, revealAll } from './fog_system.js';
import { isFogEnabled } from './map_loader.js';
import { refreshInventoryDisplay } from '../ui/inventory_menu.js';
import { player, updateStatsFromLevel } from './player.js';
import { updateHpDisplay, updateXpDisplay } from './ui/player_display.js';
import { openSaveMenu, openLoadMenu } from '../ui/save_slots_menu.js';
import { showDialogue } from './dialogue_system.js';
import * as router from './router.js';

export function handleSave() {
  openSaveMenu();
}

export function handleLoad() {
  openLoadMenu();
}

export async function loadSavedGame(slot, container, gridState) {
  loadState();
  if (!loadGame(slot)) {
    showDialogue('No save found.');
    return;
  }
  refreshInventoryDisplay();
  const mapName = gameState.currentMap || 'map01';
  try {
    const { cols: newCols } = await router.loadMap(mapName);
    gridState.cols = newCols;
    initFog(container, gridState.cols, isFogEnabled());
    if (isFogEnabled()) {
      if (router.getCurrentMapName() === 'map01') {
        revealAll();
      } else {
        reveal(player.x, player.y);
      }
    }
    updateStatsFromLevel();
    player.hp = Math.min(player.hp, player.maxHp);
    updateHpDisplay();
    updateXpDisplay();
    showDialogue('Progress loaded successfully.');
  } catch (err) {
    console.error(err);
  }
}

export function initSaveLoadEvents(container, gridState) {
  document.addEventListener('saveSlot', (e) => {
    saveState();
    saveGame(e.detail.slot);
    showDialogue('Game Saved.');
  });

  document.addEventListener('loadSlot', (e) => {
    loadSavedGame(e.detail.slot, container, gridState);
  });
}
