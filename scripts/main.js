import { loadMap, renderMap, getCurrentGrid } from './mapLoader.js';
import { openChestAt, isChestOpened, resetChestState } from './gameEngine.js';
import { findPath } from './pathfinder.js';

// Simple inventory array that stores items received during play.
export const inventory = [];

function findFirstWalkable(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'G') {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
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
  if (isMoving) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  if (grid[y][x] !== 'G') return;

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
    index++;
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
      grid[y][x] === 'C'
    ) {
      if (!isChestOpened(x, y)) {
        const item = openChestAt(x, y);
        if (item) {
          inventory.push(item);
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

  try {
    const grid = await loadMap('map01');
    cols = grid[0].length;
    renderMap(grid, container);
    resetChestState();

    const start = findFirstWalkable(grid);
    player.x = start.x;
    player.y = start.y;
    drawPlayer(player, container, cols);

    document.addEventListener('keydown', e => handleKey(e, player, container, cols));
    container.addEventListener('click', e => handleTileClick(e, player, container, cols));
  } catch (err) {
    console.error(err);
  }
});
