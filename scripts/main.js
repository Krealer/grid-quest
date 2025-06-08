import { getCurrentGrid } from './mapLoader.js';
import { openChestAt, isChestOpened } from './gameEngine.js';
import { findPath } from './pathfinder.js';
import * as router from './router.js';

// Simple inventory array that stores items received during play.
const itemDescriptions = {
  'Mysterious Key': 'A key shrouded in mystery.',
  'Ancient Coin': 'An old coin from a forgotten era.',
  'Healing Herb': 'Restores a small amount of health.'
};

export const inventory = [
  { name: 'Mysterious Key', description: itemDescriptions['Mysterious Key'] },
  { name: 'Ancient Coin', description: itemDescriptions['Ancient Coin'] },
  { name: 'Healing Herb', description: itemDescriptions['Healing Herb'] }
];

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
  if (isMoving) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  if (grid[y][x].type !== 'G' && grid[y][x].type !== 'D') return;

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
  const grid = getCurrentGrid();

  if (e.code === 'Space') {
    attemptOpenChest(player, container, grid, cols);
  }
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
      grid[y][x].type === 'C'
    ) {
      if (!isChestOpened(x, y)) {
        const item = openChestAt(x, y);
        if (item) {
          inventory.push({
            name: item,
            description: itemDescriptions[item] || ''
          });
          console.log(`Obtained ${item} from chest at (${x}, ${y})`);

          const index = y * cols + x;
          const tile = container.children[index];
          if (tile) {
            tile.classList.remove('chest');
            tile.classList.add('chest-opened');
          }
        }
      }
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('game-grid');
  const player = { x: 0, y: 0 };
  let cols = 0;

  const inventoryTab = document.querySelector('.inventory-tab');
  const overlay = document.getElementById('inventory-overlay');
  const closeBtn = document.getElementById('inventory-close');
  const itemsContainer = document.getElementById('inventory-items');

  function renderInventory() {
    itemsContainer.innerHTML = '';
    inventory.forEach(item => {
      const div = document.createElement('div');
      div.className = 'inventory-item';
      div.textContent = `${item.name} - ${item.description}`;
      itemsContainer.appendChild(div);
    });
  }

  function showInventory() {
    renderInventory();
    overlay.classList.add('active');
    inventoryTab.classList.add('active');
  }

  function hideInventory() {
    overlay.classList.remove('active');
    inventoryTab.classList.remove('active');
  }

  inventoryTab.addEventListener('click', showInventory);
  closeBtn.addEventListener('click', hideInventory);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hideInventory();
  });

  router.init(container, player);

  try {
    const { cols: newCols } = await router.loadMap('map01');
    cols = newCols;

    document.addEventListener('keydown', e => handleKey(e, player, container, cols));
    container.addEventListener('click', e => handleTileClick(e, player, container, cols));
  } catch (err) {
    console.error(err);
  }
});
