import { getCurrentGrid, isFogEnabled } from './mapLoader.js';
import { onStepEffect, isWalkable } from './tile_type.js';
import { toggleInventoryView, initInventoryUI } from './inventory_ui.js';
import { toggleQuestLog } from './quest_log.js';
import { toggleCraftMenu, initCraftMenu } from '../ui/crafting_menu_new.js';
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
import { showDialogue } from './dialogueSystem.js';
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
} from './ui/playerDisplay.js';
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
} from './settingsManager.js';
import { loadLanguage } from './language_loader.js';

// Inventory contents are managed in inventory.js

let settings = loadSettings();

let isInBattle = false;

let isMoving = false;

function handleTileClick(e, player, container, cols) {
  if (isMoving || isInBattle || isMovementDisabled()) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  const tileType = grid[y][x].type;

  // Use the centralized tile definitions to determine walkability.
  if (!isWalkable(tileType)) return;

  const path = findPath(grid, player.x, player.y, x, y);
  if (path.length === 0) return;

  let index = 0;
  isMoving = true;
  async function step() {
    if (index >= path.length) {
      isMoving = false;
      return;
    }
    const pos = path[index];
    stepTo(pos.x, pos.y);
    router.drawPlayer(player, container, cols);
    const tile = grid[player.y][player.x];
    await onStepEffect(tile.type, player, player.x, player.y);
    updateHpDisplay();
    index++;
    const delayMap = { slow: 300, normal: 150, fast: 75 };
    const delay = delayMap[settings.movementSpeed] || 150;
    setTimeout(() => requestAnimationFrame(step), delay);
  }
  requestAnimationFrame(step);
}

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
      cols = newCols;
      initFog(container, cols, isFogEnabled());
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

  initMenuBar(handleSave, handleLoad, toggleCraftMenu);
  initMainMenu();
  initInventoryUI();
  initInventoryMenu();
  initCraftMenu();
  initPlayerDisplay();
  updateHpDisplay();
  updateDefenseDisplay();
  updateXpDisplay();
  let cols = 0;

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

  try {
    const { cols: newCols } = await router.loadMap('map01');
    cols = newCols;
    initFog(container, cols, isFogEnabled());
    if (isFogEnabled()) {
      if (router.getCurrentMapName() === 'map01') {
        revealAll();
      } else {
        reveal(player.x, player.y);
      }
    }
    updateHpDisplay();
    updateXpDisplay();

    container.addEventListener('click', (e) =>
      handleTileClick(e, player, container, cols)
    );
    container.addEventListener('dblclick', async (e) => {
      if (isInBattle || isMoving || isMovementDisabled()) return;
      const newCols = await handleTileInteraction(
        e,
        player,
        container,
        cols,
        npcModules
      );
      if (newCols) {
        cols = newCols;
        initFog(container, cols, isFogEnabled());
        if (isFogEnabled()) {
          if (router.getCurrentMapName() === 'map01') {
            revealAll();
          } else {
            reveal(player.x, player.y);
          }
        }
        updateHpDisplay();
      }
    });
    document.addEventListener('combatStarted', () => {
      isInBattle = true;
    });
    document.addEventListener('combatEnded', (e) => {
      isInBattle = false;
      if (e.detail.enemyHp <= 0) {
        const enemyId = e.detail.enemy.id;
        defeatEnemy(enemyId);
        if (
          enemyId === 'goblin01' &&
          !hasItem('goblin_ear') &&
          !hasItem('goblin_insignia') &&
          !hasItem('cracked_helmet')
        ) {
          const pos = gameState.lastEnemyPos;
          if (pos) spawnEnemy(pos.x, pos.y, 'ghost_echo');
        }
        if (enemyId === 'goblin_scout') {
          setMemory('scout_defeated');
          if (
            isQuestStarted('scout_tracking') &&
            !isQuestCompleted('scout_tracking')
          ) {
            completeQuest('scout_tracking');
          }
        }
        if (enemyId === 'zombie01') {
          setMemory('flag_zombie_defeated');
        }
      }
    });

    document.addEventListener('playerRespawned', (e) => {
      cols = e.detail.cols;
      initFog(container, cols, isFogEnabled());
      if (isFogEnabled()) {
        revealAll();
      }
      updateHpDisplay();
      updateDefenseDisplay();
      updateXpDisplay();
    });
    document.addEventListener('playerDefenseChanged', updateDefenseDisplay);
    document.addEventListener('playerHpChanged', updateHpDisplay);
    document.addEventListener('playerXpChanged', updateXpDisplay);
    document.addEventListener('playerLevelUp', updateXpDisplay);
    document.addEventListener('passivesUpdated', () => {
      updateHpDisplay();
      updateDefenseDisplay();
    });
  } catch (err) {
    console.error(err);
  }
});
