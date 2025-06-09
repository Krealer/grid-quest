// Handles trap and tile effects triggered when the player steps on certain tiles.
import { showDialogue } from './dialogueSystem.js';
import { healFull } from './player.js';
import { applyDamage } from './logic.js';
import { stepSymbol } from './puzzle_state.js';

/**
 * Applies effects based on the tile symbol the player stepped on.
 *
 * @param {string} tileSymbol
 * @param {{hp:number,maxHp:number}} player
 */
export function handleTileEffects(tileSymbol, player) {
  stepSymbol(tileSymbol);
  if (tileSymbol === 't') {
    applyDamage(player, 1);
    showDialogue('A hidden snare cuts at your feet.');
  } else if (tileSymbol === 'T') {
    applyDamage(player, 2);
    showDialogue('Spikes! You\u2019re badly wounded!');
  } else if (tileSymbol === 'W') {
    healFull();
    showDialogue('The cool water rejuvenates you. HP fully restored.');
  }
}

