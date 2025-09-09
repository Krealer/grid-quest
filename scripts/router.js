import { loadMap as loadMapData, getCurrentGrid } from './mapLoader.js';
import { renderGrid } from './grid.js';
import { gameState } from './game_state.js';
import { discoverMap } from './player_memory.js';

let container = null;
let player = null;
let cols = 0;
let currentMap = '';

function findCentralWalkable(grid) {
  const height = grid.length;
  const width = grid[0].length;
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);
  const isWalkable = (x, y) => ['G', 't', 'T', 'W'].includes(grid[y][x].type);

  if (isWalkable(midX, midY)) return { x: midX, y: midY };

  const maxRadius = Math.max(width, height);
  for (let r = 1; r < maxRadius; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const x = midX + dx;
        const y = midY + dy;
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        if (isWalkable(x, y)) return { x, y };
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
  const { grid, environment, properties } = result;
  currentMap = name;
  gameState.currentMap = name;
  gameState.environment = environment;
  discoverMap(name);
  cols = grid[0].length;
  renderGrid(grid, container, environment, properties?.fog);

  if (spawnPoint) {
    player.x = spawnPoint.x;
    player.y = spawnPoint.y;
  } else {
    const start = findCentralWalkable(grid);
    player.x = start.x;
    player.y = start.y;
  }

  drawPlayer(player, container, cols);
  return { grid, cols, properties };
}

export function getCols() {
  return cols;
}

export function getCurrentMapName() {
  return currentMap;
}

