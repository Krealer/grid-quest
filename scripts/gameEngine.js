// Handles trap and tile effects triggered when the player steps on certain tiles.
import { onStepEffect } from './tile_type.js';
import { stepSymbol } from './puzzle_state.js';
import { triggerRotation } from './rotation_puzzle.js';
import { getCurrentGrid } from './mapLoader.js';

/**
 * Applies effects based on the tile symbol the player stepped on.
 *
 * @param {string} tileSymbol
 * @param {{hp:number,maxHp:number}} player
 */
export async function handleTileEffects(tileSymbol, player, x, y) {
  await stepSymbol(tileSymbol);
  const grid = getCurrentGrid();
  const tile = grid?.[y]?.[x];
  if (tile && tile.rotate) {
    triggerRotation(tile.rotate);
  }
  await onStepEffect(tileSymbol, player, x, y);
}
