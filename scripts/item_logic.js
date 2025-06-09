import { removeItem } from './inventory.js';
import { increaseDefense } from './player.js';

export function useArmorPiece() {
  if (removeItem('armor_piece', 1)) {
    increaseDefense(1);
    return true;
  }
  return false;
}
