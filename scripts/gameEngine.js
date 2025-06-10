// Handles trap and tile effects triggered when the player steps on certain tiles.
import { showDialogue } from './dialogueSystem.js';
import { healFull } from './player.js';
import { applyDamage } from './logic.js';
import { triggerDarkTrap, triggerFireTrap } from './trap_logic.js';
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
  const container = document.getElementById('game-grid');
  const index = y * grid[0].length + x;
  const tileEl = container?.children[index];
  if (tile && tile.rotate) {
    triggerRotation(tile.rotate);
  }
  if (tileSymbol === 't') {
    triggerDarkTrap(player, applyDamage, showDialogue, x, y);
    if (tileEl) {
      tileEl.classList.add('triggered');
      setTimeout(() => tileEl.classList.remove('triggered'), 400);
    }
  } else if (tileSymbol === 'T') {
    triggerFireTrap(player, applyDamage, showDialogue, x, y);
    if (tileEl) {
      tileEl.classList.add('triggered');
      setTimeout(() => tileEl.classList.remove('triggered'), 400);
    }
  } else if (tileSymbol === 'W') {
    healFull();
    showDialogue('The cool water rejuvenates you. HP fully restored.');
    if (tileEl) {
      tileEl.classList.add('ripple');
      setTimeout(() => tileEl.classList.remove('ripple'), 800);
    }
  }
}
