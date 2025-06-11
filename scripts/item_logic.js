import { consumeItem } from './inventory.js';
import { increaseDefense, addTempAttack } from './player.js';

export function useArmorPiece() {
  if (consumeItem('armor_piece', 1)) {
    increaseDefense(1);
    return true;
  }
  return false;
}

export function useDefensePotion() {
  if (consumeItem('defense_potion_I', 1)) {
    return { defense: 1 };
  }
  return null;
}

export function useDefensePotionII() {
  if (consumeItem('defense_potion_II', 1)) {
    return { defense: 2 };
  }
  return null;
}

export function useFadedBlade() {
  if (consumeItem('faded_blade', 1)) {
    addTempAttack(2);
    return { attack: 2 };
  }
  return null;
}

export function useArcaneSpark() {
  if (consumeItem('arcane_spark', 1)) {
    return { damage: 6 };
  }
  return null;
}

export function useHealthPotion() {
  if (consumeItem('health_potion', 1)) {
    return { heal: 20 };
  }
  return null;
}

export function useManaGem() {
  if (consumeItem('mana_gem', 1)) {
    return { refresh: true };
  }
  return null;
}
