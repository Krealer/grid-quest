import { removeItem } from './inventory.js';

export function giveNpcItem(id, qty = 1) {
  return removeItem(id, qty);
}

