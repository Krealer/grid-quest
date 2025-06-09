import { removeItem } from './inventory.js';
import { increaseDefense } from './player.js';

export function useArmorPiece() {
  if (removeItem('armor_piece', 1)) {
    increaseDefense(1);
    return true;
  }
  return false;
}

export function useDefensePotion() {
  if (removeItem('defense_potion_I', 1)) {
    return { defense: 1 };
  }
  return null;
}
