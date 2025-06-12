import { hasItem, useKey } from './inventory.js';
import { markItemUsed } from '../info/items.js';
import { updateInventoryUI } from './inventory_ui.js';
import { enterDoor } from './player.js';
import {
  vicarDoorMessageNorth,
  vicarDoorMessageExit
} from './dialogue_state.js';

export async function tryVicarDoor(tile) {
  if (!tile || tile.type !== 'D' || tile.requiresItem !== 'vicar_sigil')
    return null;
  if (tile.locked) {
    if (!hasItem('vicar_sigil')) {
      if (tile.message && tile.message.includes('dominion')) {
        vicarDoorMessageExit();
      } else {
        vicarDoorMessageNorth();
      }
      return null;
    }
    useKey('vicar_sigil');
    markItemUsed('vicar_sigil');
    updateInventoryUI();
    tile.locked = false;
  }
  const newCols = await enterDoor(tile.target, tile.spawn);
  return newCols;
}
