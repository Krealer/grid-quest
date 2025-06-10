// Centralized interaction logic
import { getCurrentGrid } from './mapLoader.js';
import { isAdjacent } from './logic.js';
import { gameState } from './game_state.js';
import { isInteractable, onInteractEffect } from './tile_type.js';
import { hasItem, removeItem } from './inventory.js';
import { updateInventoryUI } from './inventory_state.js';
import { showDialogue } from './dialogueSystem.js';
import { markItemUsed } from '../info/items.js';
import { enterDoor } from './player.js';

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
  if (gameState.isDead || gameState.inCombat) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  if (!grid || !grid[y] || !grid[y][x]) return;

  const tile = grid[y][x];
  const sameTile = player.x === x && player.y === y;
  if (tile.type === 'echo') {
    if (!isAdjacent(player.x, player.y, x, y) && !sameTile) return;
  } else if (!isAdjacent(player.x, player.y, x, y)) {
    return;
  }
  if (!isInteractable(tile.type)) return;

  if (tile.type === 'D' && tile.requiresItem === 'commander_badge') {
    if (!hasItem('commander_badge')) {
      showDialogue(tile.message || 'The insignia is missing.');
      return;
    }
    removeItem('commander_badge');
    markItemUsed('commander_badge');
    updateInventoryUI();
    const newCols = await enterDoor(tile.target, tile.spawn);
    return newCols;
  }

  return onInteractEffect(tile, x, y, player, container, cols, npcModules);
}
