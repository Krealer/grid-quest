import { getCurrentGrid, isFogEnabled } from './map_loader.js';
import { onStepEffect, isWalkable } from './tile_type.js';
import { toggleInventoryView, initInventoryUI } from './inventory_ui.js';
import { toggleQuestLog } from './quest_log.js';
import { player, stepTo, updateStatsFromLevel } from './player.js';
import { initFog, reveal, revealAll } from './fog_system.js';
import { loadEnemyData, defeatEnemy } from './enemy.js';
import { setMemory } from './dialogue_state.js';
import {
  completeQuest,
  isQuestStarted,
  isQuestCompleted
} from './quest_state.js';
import { findPath } from './pathfinder.js';
import * as router from './router.js';
import { showDialogue } from './dialogue_system.js';
import { handleTileInteraction } from './interaction.js';
import { isMovementDisabled } from './movement.js';
import { hasCodeFile, hasItem } from './inventory.js';
import { initMobileCenter } from './mobile_ui.js';
import { movePlayerTo, spawnEnemy } from './map.js';
import { npcModules } from './npc/index.js';
import {
  initPlayerDisplay,
  updateHpDisplay,
  updateDefenseDisplay,
  updateXpDisplay
} from './ui/player_display.js';
import { initNullTab } from './ui_state.js';
import { initNullSummary } from '../ui/null_summary.js';
import { initSkillSystem } from './skills.js';
import { initPassiveSystem } from './passive_skills.js';
import { toggleStatusPanel } from './menu/status.js';
import { toggleInfoMenu, initInfoMenu } from '../ui/info_menu.js';
import {
  refreshInventoryDisplay,
  initInventoryMenu
} from '../ui/inventory_menu.js';
import '../ui/system_message.js';
import {
  initSaveSlotsMenu,
  openSaveMenu,
  openLoadMenu
} from '../ui/save_slots_menu.js';
import { saveState, loadState, gameState } from './game_state.js';
import { saveGame, loadGame } from './save_load.js';
import { initMenuBar } from '../ui/menu_bar.js';
import { initMainMenu } from '../ui/main_menu.js';
import {
  loadSettings,
  saveSettings,
  applySettings,
  DEFAULT_SETTINGS
} from './settings_manager.js';
import { loadLanguage } from './language_loader.js';
import { initGreeting } from '../ui/greeting.js';
import { startGame } from './start_game.js';
import { rollbackTo } from './rollback.js';

// Inventory contents are managed in inventory.js

let settings = loadSettings();

const gridState = { cols: 0 };

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('game-grid');
  // Prevent double-tap zoom on mobile devices
  document.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
  let lastTouch = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouch <= 300) {
        e.preventDefault();
      }
      lastTouch = now;
    },
    { passive: false }
  );
  const inventoryTab = document.querySelector('.inventory-tab');
  const inventoryOverlay = document.getElementById('inventory-overlay');
  const closeBtn = inventoryOverlay.querySelector('.close-btn');
  const questsTab = document.querySelector('.quests-tab');
  const questsOverlay = document.getElementById('quest-log-overlay');
  const questsClose = questsOverlay.querySelector('.close-btn');
  const statusTab = document.querySelector('.status-tab');
  const nullTab = document.querySelector('.null-tab');
  const statusOverlay = document.getElementById('status-overlay');
  const statusClose = statusOverlay?.querySelector('.close-btn');
  const infoTab = document.querySelector('.info-tab');
  const infoOverlay = document.getElementById('info-overlay');
  const infoClose = infoOverlay?.querySelector('.close-btn');
  const settingsTab = document.querySelector('.settings-tab');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsClose = settingsOverlay.querySelector('.close-btn');
  const coordsToggle = document.getElementById('coords-toggle');
  const moveSelect = document.getElementById('move-speed');
  const combatSelect = document.getElementById('combat-speed');
  const colorblindToggle = document.getElementById('colorblind-toggle');
  const labelToggle = document.getElementById('label-toggle');
  const dialogueToggle = document.getElementById('dialogue-toggle');
  const langSelect = document.getElementById('language-select');
  const centerToggle = document.getElementById('center-toggle');
  const resetBtn = document.getElementById('reset-settings');
  const rollbackRow = document.getElementById('rollback-row');
  const rollbackSelect = document.getElementById('rollback-select');
  const rollbackBtn = document.getElementById('rollback-btn');

  if (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.NODE_ENV !== 'development'
  ) {
    rollbackRow.style.display = 'none';
  }

  function handleSave() {
    openSaveMenu();
  }

  function handleLoad() {
    openLoadMenu();
  }

  async function performLoad(slot) {
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

  document.addEventListener('saveSlot', (e) => {
    saveState();
    saveGame(e.detail.slot);
    showDialogue('Game Saved.');
  });

  document.addEventListener('loadSlot', (e) => {
    performLoad(e.detail.slot);
  });

  initMenuBar(handleSave, handleLoad);
  initMainMenu();
  initInventoryUI();
  initInventoryMenu();
  initPlayerDisplay();
  updateHpDisplay();
  updateDefenseDisplay();
  updateXpDisplay();

  settings = loadSettings();
  applySettings(settings);
  coordsToggle.checked = settings.gridCoordinates;
  moveSelect.value = settings.movementSpeed;
  combatSelect.value = settings.combatSpeed;
  colorblindToggle.checked = settings.colorblind;
  labelToggle.checked = settings.tileLabels;
  dialogueToggle.checked = settings.dialogueAnim;
  langSelect.value = settings.language;
  centerToggle.checked = settings.centerMode;
  loadLanguage(settings.language);

  router.init(container, player);
  initMobileCenter(container);
  initSkillSystem(player);
  initPassiveSystem(player);
  initInfoMenu();
  initNullSummary();
  initSaveSlotsMenu();

  try {
    await loadEnemyData();
  } catch (e) {
    console.error('Failed to load enemies', e);
  }

  inventoryTab.addEventListener('click', toggleInventoryView);
  closeBtn.addEventListener('click', toggleInventoryView);
  inventoryOverlay.addEventListener('click', (e) => {
    if (e.target === inventoryOverlay) toggleInventoryView();
  });
  questsTab.addEventListener('click', toggleQuestLog);
  questsClose.addEventListener('click', toggleQuestLog);
  questsOverlay.addEventListener('click', (e) => {
    if (e.target === questsOverlay) toggleQuestLog();
  });
  if (statusTab) statusTab.addEventListener('click', toggleStatusPanel);
  if (statusClose) statusClose.addEventListener('click', toggleStatusPanel);
  if (statusOverlay) {
    statusOverlay.addEventListener('click', (e) => {
      if (e.target === statusOverlay) toggleStatusPanel();
    });
  }
  if (infoTab) infoTab.addEventListener('click', toggleInfoMenu);
  if (infoClose) infoClose.addEventListener('click', toggleInfoMenu);
  if (infoOverlay) {
    infoOverlay.addEventListener('click', (e) => {
      if (e.target === infoOverlay) toggleInfoMenu();
    });
  }

  function updateNullTab() {
    if (!nullTab) return;
    if (hasCodeFile()) {
      nullTab.classList.remove('disabled');
    } else {
      nullTab.classList.add('disabled');
    }
  }

  if (nullTab) {
    initNullTab(nullTab);
    updateNullTab();
  }
  document.addEventListener('inventoryUpdated', updateNullTab);

  function showSettings() {
    settingsOverlay.classList.add('active');
  }

  function hideSettings() {
    settingsOverlay.classList.remove('active');
  }

  settingsTab.addEventListener('click', showSettings);
  settingsClose.addEventListener('click', hideSettings);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) hideSettings();
  });

  coordsToggle.addEventListener('change', () => {
    settings.gridCoordinates = coordsToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  moveSelect.addEventListener('change', () => {
    settings.movementSpeed = moveSelect.value;
    saveSettings(settings);
  });

  combatSelect.addEventListener('change', () => {
    settings.combatSpeed = combatSelect.value;
    saveSettings(settings);
  });

  colorblindToggle.addEventListener('change', () => {
    settings.colorblind = colorblindToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  labelToggle.addEventListener('change', () => {
    settings.tileLabels = labelToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  dialogueToggle.addEventListener('change', () => {
    settings.dialogueAnim = dialogueToggle.checked;
    saveSettings(settings);
  });

  langSelect.addEventListener('change', () => {
    settings.language = langSelect.value;
    saveSettings(settings);
    loadLanguage(settings.language);
  });

  centerToggle.addEventListener('change', () => {
    settings.centerMode = centerToggle.checked;
    saveSettings(settings);
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Reset all settings?')) {
      settings = { ...DEFAULT_SETTINGS };
      saveSettings(settings);
      applySettings(settings);
      coordsToggle.checked = settings.gridCoordinates;
      moveSelect.value = settings.movementSpeed;
      combatSelect.value = settings.combatSpeed;
      colorblindToggle.checked = settings.colorblind;
      labelToggle.checked = settings.tileLabels;
      dialogueToggle.checked = settings.dialogueAnim;
      langSelect.value = settings.language;
      centerToggle.checked = settings.centerMode;
      loadLanguage(settings.language);
    }
  });

  rollbackBtn.addEventListener('click', () => {
    rollbackTo(rollbackSelect.value);
    alert(`Rolled back to ${rollbackSelect.value}`);
  });

  const { showGreeting } = initGreeting(() =>
    startGame(container, settings, gridState)
  );
  const hasSave =
    localStorage.getItem('gridquest.state') ||
    localStorage.getItem('tutorialComplete');
  if (hasSave) {
    startGame(container, settings, gridState);
  } else {
    showGreeting();
  }
});
