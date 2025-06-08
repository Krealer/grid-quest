import { loadMap, renderMap, getCurrentGrid } from './mapLoader.js';
import { openChestAt, isChestOpened, resetChestState } from './gameEngine.js';

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

function handleKey(e, player, container, cols) {
  const grid = getCurrentGrid();

  if (e.code === 'Space') {
    attemptOpenChest(player, container, grid, cols);
    return;
  }

  let dx = 0;
  let dy = 0;
  switch (e.key) {
    case 'ArrowUp':
      dy = -1;
      break;
    case 'ArrowDown':
      dy = 1;
      break;
    case 'ArrowLeft':
      dx = -1;
      break;
    case 'ArrowRight':
      dx = 1;
      break;
    default:
      return;
  }
  e.preventDefault();
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (
    newY < 0 ||
    newY >= grid.length ||
    newX < 0 ||
    newX >= grid[0].length ||
    grid[newY][newX] !== 'G'
  ) {
    return;
  }
  player.x = newX;
  player.y = newY;
  drawPlayer(player, container, cols);
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
  } catch (err) {
    console.error(err);
  }
});
