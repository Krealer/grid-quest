// Handles trap and tile effects triggered when the player steps on certain tiles.
import { showDialogue } from './dialogueSystem.js';
import { takeDamage, healFull } from './player.js';

/**
 * Applies effects based on the tile symbol the player stepped on.
 *
 * @param {string} tileSymbol
 * @param {{hp:number,maxHp:number}} player
 */
export function handleTileEffects(tileSymbol, player) {
  if (tileSymbol === 't') {
    takeDamage(1);
    showDialogue('A hidden snare cuts at your feet.');
  } else if (tileSymbol === 'T') {
    takeDamage(2);
    showDialogue('Spikes! You\u2019re badly wounded!');
  } else if (tileSymbol === 'W') {
    healFull();
    showDialogue('The cool water rejuvenates you. HP fully restored.');
  }
}

