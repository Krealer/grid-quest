// Handles trap and tile effects triggered when the player steps on certain tiles.
import { showDialogue } from './dialogueSystem.js';
import { healFull } from './player.js';
import { applyDamage } from './logic.js';
import { triggerDarkTrap, triggerFireTrap } from './trap_logic.js';
import { stepSymbol } from './puzzle_state.js';

/**
 * Applies effects based on the tile symbol the player stepped on.
 *
 * @param {string} tileSymbol
 * @param {{hp:number,maxHp:number}} player
 */
export function handleTileEffects(tileSymbol, player, x, y) {
  stepSymbol(tileSymbol);
  if (tileSymbol === 't') {
    triggerDarkTrap(player, applyDamage, showDialogue, x, y);
  } else if (tileSymbol === 'T') {
    triggerFireTrap(player, applyDamage, showDialogue, x, y);
  } else if (tileSymbol === 'W') {
    healFull();
    showDialogue('The cool water rejuvenates you. HP fully restored.');
  }
}

