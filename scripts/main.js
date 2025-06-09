import { getCurrentGrid } from './mapLoader.js';
import { handleTileEffects } from './gameEngine.js';
import { toggleInventoryView } from './inventory_state.js';
import { player } from './player.js';
import { loadEnemyData, defeatEnemy } from './enemy.js';
import { findPath } from './pathfinder.js';
import * as router from './router.js';
import { showDialogue } from './dialogueSystem.js';
import { handleTileInteraction } from './interaction.js';
import { isMovementDisabled } from './movement.js';
import * as eryndor from './npc/eryndor.js';
import * as lioran from './npc/lioran.js';
import { initSkillSystem } from './skills.js';
import { saveState, loadState, gameState } from './game_state.js';
import {
  loadSettings,
  saveSettings,
  applySettings,
} from './settingsManager.js';

// Inventory contents are managed in inventory.js

let isInBattle = false;
const npcModules = { eryndor, lioran };

let hpDisplay;

function updateHpDisplay() {
  if (hpDisplay) {
    hpDisplay.textContent = `HP: ${player.hp}/${player.maxHp}`;
  }
}

function drawPlayer(player, container, cols) {
  container.querySelectorAll('.player').forEach(el => el.classList.remove('player'));
  const index = player.y * cols + player.x;
  const tile = container.children[index];
  if (tile) {
    tile.classList.add('player');
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
    drawPlayer(player, container, cols);
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
  const settingsTab = document.querySelector('.settings-tab');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsClose = settingsOverlay.querySelector('.close-btn');
  const saveTab = document.querySelector('.save-tab');
  const loadTab = document.querySelector('.load-tab');
  const soundToggle = document.getElementById('sound-toggle');
  const scaleSelect = document.getElementById('ui-scale');
  const animToggle = document.getElementById('anim-toggle');
  hpDisplay = document.getElementById('hp-display');
  updateHpDisplay();
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
    const { cols: newCols } = await router.loadMap(mapName);
    cols = newCols;
    player.maxHp = 100 + (gameState.maxHpBonus || 0);
    player.hp = Math.min(player.hp, player.maxHp);
    updateHpDisplay();
    showDialogue('Game loaded!');
  });

  try {
    const { cols: newCols } = await router.loadMap('map01');
    cols = newCols;
    updateHpDisplay();

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
      }
    });

    document.addEventListener('playerRespawned', e => {
      cols = e.detail.cols;
      updateHpDisplay();
    });
  } catch (err) {
    console.error(err);
  }
});
