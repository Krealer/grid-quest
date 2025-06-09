import { getCurrentGrid } from './mapLoader.js';
import { handleTileEffects } from './gameEngine.js';
import { toggleInventoryView } from './inventory_state.js';
import { toggleQuestLog } from './quest_log.js';
import { player } from './player.js';
import { loadEnemyData, defeatEnemy } from './enemy.js';
import { setMemory } from './dialogue_state.js';
import { completeQuest, isQuestStarted, isQuestCompleted } from './quest_state.js';
import { findPath } from './pathfinder.js';
import * as router from './router.js';
import { showDialogue } from './dialogueSystem.js';
import { handleTileInteraction } from './interaction.js';
import { isMovementDisabled } from './movement.js';
import * as eryndor from './npc/eryndor.js';
import * as lioran from './npc/lioran.js';
import * as goblinQuestGiver from './npc/goblin_quest_giver.js';
import * as arvalin from './npc/arvalin.js';
import * as grindle from './npc/grindle.js';
import { initSkillSystem } from './skills.js';
import { saveState, loadState, gameState } from './game_state.js';
import {
  loadSettings,
  saveSettings,
  applySettings,
} from './settingsManager.js';

// Inventory contents are managed in inventory.js

let isInBattle = false;
const npcModules = { eryndor, lioran, goblinQuestGiver, arvalin, grindle };

let hpDisplay;
let defenseDisplay;
let xpDisplay;

function updateHpDisplay() {
  if (hpDisplay) {
    hpDisplay.textContent = `HP: ${player.hp}/${player.maxHp}`;
  }
}

function updateDefenseDisplay() {
  if (defenseDisplay) {
    defenseDisplay.textContent = `Defense: ${player.stats?.defense || 0}`;
  }
}

function updateXpDisplay() {
  if (xpDisplay) {
    xpDisplay.textContent = `Level: ${player.level} XP: ${player.xp}/${player.xpToNextLevel}`;
  }
}


let isMoving = false;

function handleTileClick(e, player, container, cols) {
  if (isMoving || isInBattle || isMovementDisabled()) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  const tileType = grid[y][x].type;

  // Doors are interacted with via double-click, so they are not walkable.
  if (!['G', 't', 'T', 'W'].includes(tileType)) return;

  const path = findPath(grid, player.x, player.y, x, y);
  if (path.length === 0) return;

  let index = 0;
  isMoving = true;
  function step() {
    if (index >= path.length) {
      isMoving = false;
      return;
    }
    const pos = path[index];
    player.x = pos.x;
    player.y = pos.y;
    router.drawPlayer(player, container, cols);
    const tile = grid[player.y][player.x];
    handleTileEffects(tile.type, player);
    updateHpDisplay();
    index++;
    setTimeout(() => requestAnimationFrame(step), 150);
  }
  requestAnimationFrame(step);
}


document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('game-grid');
  const inventoryTab = document.querySelector('.inventory-tab');
  const inventoryOverlay = document.getElementById('inventory-overlay');
  const closeBtn = inventoryOverlay.querySelector('.close-btn');
  const questsTab = document.querySelector('.quests-tab');
  const questsOverlay = document.getElementById('quest-log-overlay');
  const questsClose = questsOverlay.querySelector('.close-btn');
  const settingsTab = document.querySelector('.settings-tab');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsClose = settingsOverlay.querySelector('.close-btn');
  const saveTab = document.querySelector('.save-tab');
  const loadTab = document.querySelector('.load-tab');
  const soundToggle = document.getElementById('sound-toggle');
  const scaleSelect = document.getElementById('ui-scale');
  const animToggle = document.getElementById('anim-toggle');
  hpDisplay = document.getElementById('hp-display');
  defenseDisplay = document.getElementById('defense-display');
  xpDisplay = document.getElementById('xp-display');
  updateHpDisplay();
  updateDefenseDisplay();
  updateXpDisplay();
  let cols = 0;

  let settings = loadSettings();
  applySettings(settings);
  soundToggle.checked = settings.sound;
  scaleSelect.value = settings.scale;
  animToggle.checked = settings.animations;

  router.init(container, player);
  initSkillSystem(player);

  try {
    await loadEnemyData();
  } catch (e) {
    console.error('Failed to load enemies', e);
  }

  inventoryTab.addEventListener('click', toggleInventoryView);
  closeBtn.addEventListener('click', toggleInventoryView);
  inventoryOverlay.addEventListener('click', e => {
    if (e.target === inventoryOverlay) toggleInventoryView();
  });
  questsTab.addEventListener('click', toggleQuestLog);
  questsClose.addEventListener('click', toggleQuestLog);
  questsOverlay.addEventListener('click', e => {
    if (e.target === questsOverlay) toggleQuestLog();
  });

  function showSettings() {
    settingsOverlay.classList.add('active');
  }

  function hideSettings() {
    settingsOverlay.classList.remove('active');
  }

  settingsTab.addEventListener('click', showSettings);
  settingsClose.addEventListener('click', hideSettings);
  settingsOverlay.addEventListener('click', e => {
    if (e.target === settingsOverlay) hideSettings();
  });

  soundToggle.addEventListener('change', () => {
    settings.sound = soundToggle.checked;
    saveSettings(settings);
  });

  scaleSelect.addEventListener('change', () => {
    settings.scale = scaleSelect.value;
    applySettings(settings);
    saveSettings(settings);
  });

  animToggle.addEventListener('change', () => {
    settings.animations = animToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  saveTab.addEventListener('click', () => {
    saveState();
    showDialogue('Game saved!');
  });

  loadTab.addEventListener('click', async () => {
    loadState();
    const mapName = gameState.currentMap || 'map01';
    try {
      const { cols: newCols } = await router.loadMap(mapName);
      cols = newCols;
      player.maxHp = 100 + (gameState.maxHpBonus || 0);
      player.hp = Math.min(player.hp, player.maxHp);
      updateHpDisplay();
      updateXpDisplay();
      showDialogue('Game loaded!');
    } catch (err) {
      console.error(err);
    }
  });

  try {
    const { cols: newCols } = await router.loadMap('map01');
    cols = newCols;
    updateHpDisplay();
    updateXpDisplay();

    container.addEventListener('click', e => handleTileClick(e, player, container, cols));
    container.addEventListener('dblclick', async e => {
      if (isInBattle || isMoving || isMovementDisabled()) return;
      const newCols = await handleTileInteraction(e, player, container, cols, npcModules);
      if (newCols) {
        cols = newCols;
        updateHpDisplay();
      }
    });
    document.addEventListener('combatStarted', () => {
      isInBattle = true;
    });
    document.addEventListener('combatEnded', e => {
      isInBattle = false;
      if (e.detail.enemyHp <= 0) {
        const enemyId = e.detail.enemy.id;
        defeatEnemy(enemyId);
        if (enemyId === 'goblin_scout') {
          setMemory('scout_defeated');
          if (isQuestStarted('scout_tracking') && !isQuestCompleted('scout_tracking')) {
            completeQuest('scout_tracking');
          }
        }
      }
    });

    document.addEventListener('playerRespawned', e => {
      cols = e.detail.cols;
      updateHpDisplay();
      updateDefenseDisplay();
      updateXpDisplay();
    });
    document.addEventListener('playerDefenseChanged', updateDefenseDisplay);
    document.addEventListener('playerXpChanged', updateXpDisplay);
    document.addEventListener('playerLevelUp', updateXpDisplay);
  } catch (err) {
    console.error(err);
  }
});
