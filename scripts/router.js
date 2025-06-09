import { loadMap as loadMapData, getCurrentGrid } from './mapLoader.js';
import { renderGrid } from './grid.js';
import { gameState } from './game_state.js';
import { discoverMap } from './player_memory.js';

let container = null;
let player = null;
let cols = 0;
let currentMap = '';

function findFirstWalkable(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (['G', 't', 'T', 'W'].includes(grid[y][x].type)) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
}

export function drawPlayer(playerObj, containerEl, colsCount) {
  containerEl
    .querySelectorAll('.player')
    .forEach(el => el.classList.remove('player'));
  const index = playerObj.y * colsCount + playerObj.x;
  const tile = containerEl.children[index];
  if (tile) {
    tile.classList.add('player');
  }
}

export function init(gameContainer, playerObj) {
  container = gameContainer;
  player = playerObj;
}

export async function loadMap(filename, spawnPoint) {
  const name = filename.replace(/\.json$/, '');
  const result = await loadMapData(name);
  if (!result) {
    return { grid: getCurrentGrid(), cols };
  }
  const { grid, environment } = result;
  currentMap = name;
  gameState.currentMap = name;
  gameState.environment = environment;
  discoverMap(name);
  cols = grid[0].length;
  renderGrid(grid, container, environment);

  // Mark chests that were previously opened
  for (const id of gameState.openedChests) {
    const [map, coord] = id.split(':');
    if (map !== name) continue;
    const [cx, cy] = coord.split(',').map(Number);
    const index = cy * cols + cx;
    const tileEl = container.children[index];
    if (tileEl) {
      tileEl.classList.remove('chest');
      tileEl.classList.add('chest-opened');
    }
  }

  if (spawnPoint) {
    player.x = spawnPoint.x;
    player.y = spawnPoint.y;
  } else {
    const start = findFirstWalkable(grid);
    player.x = start.x;
    player.y = start.y;
  }

  drawPlayer(player, container, cols);
  return { grid, cols };
}

export function getCols() {
  return cols;
}

export function getCurrentMapName() {
  return currentMap;
}

