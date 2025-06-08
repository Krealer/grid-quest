import { getCurrentGrid } from './mapLoader.js';
import {
  openChestAt,
  isChestOpened,
  isAdjacent,
  handleTileEffects,
} from './gameEngine.js';
import { findPath } from './pathfinder.js';
import * as router from './router.js';
import { startCombat } from './combatSystem.js';
import { showDialogue } from './dialogueSystem.js';
import { initSkillSystem, unlockSkill, getAllSkills } from './skills.js';
import {
  loadSettings,
  saveSettings,
  applySettings,
} from './settingsManager.js';

// Simple inventory array that stores items received during play.
// Pre-populated with a few mock items for demonstration purposes.
export const inventory = [
  { name: 'Mysterious Key', description: 'A rusty key of unknown origin.' },
  { name: 'Ancient Coin', description: 'An old coin from a forgotten era.' },
  { name: 'Healing Herb', description: 'Restores a small amount of health.' },
];

let enemyDefinitions = {};
let isInBattle = false;

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
  if (isMoving || isInBattle) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  const tileType = grid[y][x].type;

  if (tileType === 'D' && !isAdjacent(player.x, player.y, x, y)) {
    return;
  }

  if (!['G', 'D', 't', 'T', 'W'].includes(tileType)) return;

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
    if (tile.type === 'D') {
      isMoving = false;
      index = path.length;
      router
        .loadMap(tile.target, tile.spawn)
        .then(({ cols: newCols }) => {
          cols = newCols;
        })
        .catch(console.error);
      return;
    }
    setTimeout(() => requestAnimationFrame(step), 150);
  }
  requestAnimationFrame(step);
}

function handleKey(e, player, container, cols) {
  if (isInBattle) return;
  const grid = getCurrentGrid();

  if (e.code === 'Space') {
    if (!attemptStartCombat(player, container, grid, cols)) {
      if (!attemptOpenChest(player, container, grid, cols)) {
        attemptDrinkWater(player, grid);
      }
    }
  }
}

function attemptStartCombat(player, container, grid, cols) {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  for (const dir of directions) {
    const x = player.x + dir.x;
    const y = player.y + dir.y;
    if (
      y >= 0 &&
      y < grid.length &&
      x >= 0 &&
      x < grid[0].length &&
      grid[y][x].type === 'E' &&
      isAdjacent(player.x, player.y, x, y)
    ) {
      const index = y * cols + x;
      const tile = container.children[index];
      if (tile) {
        tile.classList.remove('enemy', 'blocked');
        tile.classList.add('ground');
      }
      grid[y][x].type = 'G';
      const enemy = enemyDefinitions['E'] || { name: 'Enemy', hp: 50 };
      isInBattle = true;
      const intro = enemy.intro || 'A foe appears!';
      showDialogue(intro, () => startCombat({ id: 'E', ...enemy }, player));
      return true;
    }
  }
  return false;
}

function attemptOpenChest(player, container, grid, cols) {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  for (const dir of directions) {
    const x = player.x + dir.x;
    const y = player.y + dir.y;
    if (
      y >= 0 &&
      y < grid.length &&
      x >= 0 &&
      x < grid[0].length &&
      grid[y][x].type === 'C' &&
      isAdjacent(player.x, player.y, x, y)
    ) {
      if (!isChestOpened(x, y)) {
        const item = openChestAt(x, y);
        if (item) {
          inventory.push(item);
          showDialogue(`You obtained ${item.name}!`);

          const index = y * cols + x;
          const tile = container.children[index];
          if (tile) {
            tile.classList.remove('chest');
            tile.classList.add('chest-opened');
          }

          const chestId = `${router.getCurrentMapName()}:${x},${y}`;
          for (const [id, skill] of Object.entries(getAllSkills())) {
            if (skill.unlockCondition?.chest === chestId) {
              if (unlockSkill(id)) {
                showDialogue(`You've learned a new skill: ${skill.name}!`);
              }
            }
          }
        }
      }
      return true;
    }
  }
  return false;
}

function attemptDrinkWater(player, grid) {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  for (const dir of directions) {
    const x = player.x + dir.x;
    const y = player.y + dir.y;
    if (
      y >= 0 &&
      y < grid.length &&
      x >= 0 &&
      x < grid[0].length &&
      grid[y][x].type === 'W' &&
      isAdjacent(player.x, player.y, x, y)
    ) {
      player.hp = player.maxHp;
      updateHpDisplay();
      showDialogue('You kneel and drink the water. You feel completely restored.');
      return true;
    }
  }
  return false;
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('game-grid');
  const inventoryTab = document.querySelector('.inventory-tab');
  const inventoryOverlay = document.getElementById('inventory-overlay');
  const inventoryList = document.getElementById('inventory-list');
  const closeBtn = inventoryOverlay.querySelector('.close-btn');
  const settingsTab = document.querySelector('.settings-tab');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsClose = settingsOverlay.querySelector('.close-btn');
  const soundToggle = document.getElementById('sound-toggle');
  const scaleSelect = document.getElementById('ui-scale');
  const animToggle = document.getElementById('anim-toggle');
  const hpDisplay = document.getElementById('hp-display');
  const player = { x: 0, y: 0, hp: 100, maxHp: 100 };
  function updateHpDisplay() {
    if (hpDisplay) {
      hpDisplay.textContent = `HP: ${player.hp}/${player.maxHp}`;
    }
  }
  let cols = 0;

  let settings = loadSettings();
  applySettings(settings);
  soundToggle.checked = settings.sound;
  scaleSelect.value = settings.scale;
  animToggle.checked = settings.animations;

  router.init(container, player);
  initSkillSystem(player);

  try {
    const res = await fetch('data/enemies.json');
    if (res.ok) {
      enemyDefinitions = await res.json();
    }
  } catch (e) {
    console.error('Failed to load enemies', e);
  }

  function renderInventory() {
    inventoryList.innerHTML = '';
    inventory.forEach(item => {
      const row = document.createElement('div');
      row.classList.add('inventory-item');
      row.innerHTML = `<strong>${item.name}</strong><div class="desc">${item.description}</div>`;
      inventoryList.appendChild(row);
    });
  }

  function showInventory() {
    renderInventory();
    inventoryOverlay.classList.add('active');
  }

  function hideInventory() {
    inventoryOverlay.classList.remove('active');
  }

  inventoryTab.addEventListener('click', showInventory);
  closeBtn.addEventListener('click', hideInventory);
  inventoryOverlay.addEventListener('click', e => {
    if (e.target === inventoryOverlay) hideInventory();
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

  try {
    const { cols: newCols } = await router.loadMap('map01');
    cols = newCols;
    updateHpDisplay();

    document.addEventListener('keydown', e => handleKey(e, player, container, cols));
    container.addEventListener('click', e => handleTileClick(e, player, container, cols));
    document.addEventListener('combatEnded', e => {
      isInBattle = false;
      if (e.detail.enemyHp <= 0) {
        const enemyId = e.detail.enemy.id;
        for (const [id, skill] of Object.entries(getAllSkills())) {
          if (skill.unlockCondition?.enemy === enemyId) {
            if (unlockSkill(id)) {
              showDialogue(`You've learned a new skill: ${skill.name}!`);
            }
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
});
