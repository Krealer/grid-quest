// Handles trap and tile effects triggered when the player steps on
// certain tiles.
import { showDialogue } from './dialogueSystem.js';

/**
 * Applies effects based on the tile symbol the player stepped on.
 *
 * @param {string} tileSymbol
 * @param {{hp:number,maxHp:number}} player
 */
export function handleTileEffects(tileSymbol, player) {
  if (tileSymbol === 't') {
    player.hp = Math.max(0, player.hp - 5);
    showDialogue('You stepped on a hidden spike. -5 HP.');
  } else if (tileSymbol === 'T') {
    player.hp = Math.max(0, player.hp - 15);
    showDialogue('A trap! You were badly hurt. -15 HP.');
  }
}

