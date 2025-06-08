import { loadMap as loadMapData, renderMap } from './mapLoader.js';
import { resetChestState } from './gameEngine.js';

let container = null;
let player = null;
let cols = 0;
let currentMap = '';

function findFirstWalkable(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x].type === 'G') {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
}

function drawPlayer(playerObj, containerEl, colsCount) {
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
  currentMap = name;
  const { grid, environment } = await loadMapData(name);
  cols = grid[0].length;
  renderMap(grid, container, environment);
  resetChestState();

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

