// Centralized interaction logic
import { getCurrentGrid } from './map_loader.js';
import { isAdjacent } from './logic.js';
import { gameState } from './game_state.js';
import { isInteractable, onInteractEffect } from './tile_type.js';
import { hasItem, removeItem, useKey } from './inventory.js';
import { updateInventoryUI } from './inventory_ui.js';
import { showDialogue } from './dialogue_system.js';
import { markItemUsed } from '../info/items.js';
import { setMemory } from './dialogue_state.js';
import { enterDoor } from './player.js';
import { tryVicarDoor } from './door_logic.js';
import { hasSealingDust, isSealPuzzleSolved } from './player_memory.js';

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
    // Echoes can be triggered from the same tile or an adjacent one
    if (!isAdjacent(player.x, player.y, x, y) && !sameTile) return;
  } else if (!isAdjacent(player.x, player.y, x, y)) {
    return;
  }
  if (!isInteractable(tile.type)) return;

  // Chests and other interactables are handled through onInteractEffect,
  // which will grant items and remove opened chests from the map.

  if (tile.type === 'D' && tile.requiresItem === 'commander_badge') {
    if (!hasItem('commander_badge')) {
      showDialogue(tile.message || 'The insignia is missing.');
      return;
    }
    useKey('commander_badge');
    markItemUsed('commander_badge');
    updateInventoryUI();
    const newCols = await enterDoor(tile.target, tile.spawn);
    return newCols;
  }

  if (tile.type === 'D' && tile.requiresItem === 'rift_stone' && tile.locked) {
    if (!hasItem('rift_stone')) {
      showDialogue(tile.message || 'A rift barrier blocks the way.');
      return;
    }
    useKey('rift_stone');
    markItemUsed('rift_stone');
    updateInventoryUI();
    tile.locked = false;
    const newCols = await enterDoor(tile.target, tile.spawn);
    return newCols;
  }

  if (tile.type === 'D' && tile.requiresItem === 'rift_eye' && tile.locked) {
    if (!hasItem('rift_eye')) {
      showDialogue(
        tile.message || 'A singular socket awaits a gaze… but you hold no eye.'
      );
      return;
    }
    useKey('rift_eye');
    markItemUsed('rift_eye');
    updateInventoryUI();
    tile.locked = false;
    setMemory('entered_map06');
    const newCols = await enterDoor(tile.target, tile.spawn);
    return newCols;
  }

  if (tile.type === 'D' && tile.requiresItem === 'maze_key_1' && tile.locked) {
    if (!hasItem('maze_key_1')) {
      showDialogue(tile.message || 'The door is sealed by an unfamiliar lock.');
      return;
    }
    useKey('maze_key_1');
    markItemUsed('maze_key_1');
    updateInventoryUI();
    tile.locked = false;
    const newCols = await enterDoor(tile.target, tile.spawn);
    return newCols;
  }

  if (tile.type === 'D' && tile.requiresItem === 'maze_key_2' && tile.locked) {
    if (!hasItem('maze_key_2')) {
      showDialogue(tile.message || 'A sturdy gate bars your path.');
      return;
    }
    useKey('maze_key_2');
    markItemUsed('maze_key_2');
    updateInventoryUI();
    tile.locked = false;
    const newCols = await enterDoor(tile.target, tile.spawn);
    return newCols;
  }

  if (tile.type === 'D' && tile.requiresItem === 'sealing_dust' && tile.locked) {
    if (!hasSealingDust() && !isSealPuzzleSolved()) {
      showDialogue(tile.message || 'A shimmering seal bars your way.');
      return;
    }
    tile.locked = false;
    const newCols = await enterDoor(tile.target, tile.spawn);
    return newCols;
  }

  if (tile.type === 'D' && tile.requiresItem === 'vicar_sigil') {
    const newCols = await tryVicarDoor(tile);
    return newCols;
  }

  return onInteractEffect(tile, x, y, player, container, cols, npcModules);
}
