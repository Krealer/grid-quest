import * as router from './router.js';
import { renderGrid } from './grid.js';
import { player } from './player.js';
import { getCurrentGrid, getCurrentEnvironment, isFogEnabled } from './map_loader.js';

/**
 * Move the player to a given map and coordinates.
 * @param {string} mapId - Map filename or id (without .json).
 * @param {{x:number,y:number}} coords - Destination coordinates.
 * @returns {Promise<number>} Number of columns in the new map grid.
 */
export async function movePlayerTo(mapId, coords) {
  const name = mapId.replace(/\.json$/, '');
  const { cols } = await router.loadMap(name, coords);
  return cols;
}

export function spawnNpc(x, y, id) {
  const grid = getCurrentGrid();
  const container = document.getElementById('game-grid');
  if (!grid || !container) return;
  if (!grid[y] || !grid[y][x]) return;
  grid[y][x] = { type: 'N', npc: id };
  renderGrid(grid, container, getCurrentEnvironment(), isFogEnabled());
  router.drawPlayer(player, container, router.getCols());
}

export function spawnEnemy(x, y, id) {
  const grid = getCurrentGrid();
  const container = document.getElementById('game-grid');
  if (!grid || !container) return;
  if (!grid[y] || !grid[y][x]) return;
  grid[y][x] = { type: 'E', enemyId: id };
  renderGrid(grid, container, getCurrentEnvironment(), isFogEnabled());
  router.drawPlayer(player, container, router.getCols());
}
