// Centralized interaction logic
import { getCurrentGrid } from './mapLoader.js';
import { isAdjacent } from './logic.js';
import { gameState } from './game_state.js';
import { isInteractable, onInteractEffect } from './tile_type.js';

/**
 * Handles double click interactions on tiles.
 *
 * @param {MouseEvent} e The originating event
 * @param {{x:number,y:number,hp:number,maxHp:number}} player Player state
 * @param {HTMLElement} container Grid DOM element
 * @param {number} cols Number of columns in the current grid
 * @param {Record<string, any>} npcModules Map of npc id to module with interact()
 * @returns {Promise<number|void>} Updated column count if a door was triggered
 */
export async function handleTileInteraction(
  e,
  player,
  container,
  cols,
  npcModules = {}
) {
  if (gameState.isDead) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  if (!grid || !grid[y] || !grid[y][x]) return;
  if (!isAdjacent(player.x, player.y, x, y)) return;

  const tile = grid[y][x];
  if (!isInteractable(tile.type)) return;
  return onInteractEffect(tile, x, y, player, container, cols, npcModules);
}
