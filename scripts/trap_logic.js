import { reveal } from './fog_system.js';
import { applyStatus } from './statusManager.js';

export function triggerDarkTrap(player, applyDamage, showDialogue, x, y) {
  applyDamage(player, 2);
  applyStatus(player, 'weakened', 2);
  showDialogue('Shadows coil around you, draining your strength.');
  reveal(x, y);
}

export function triggerFireTrap(player, applyDamage, showDialogue, x, y) {
  applyDamage(player, 3);
  applyStatus(player, 'burned', 2);
  showDialogue('Fire erupts beneath your feet!');
  reveal(x, y);
}
