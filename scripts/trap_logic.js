import { reveal } from './fog_system.js';
import { applyStatus } from './status_manager.js';

export function triggerDarkTrap(player, applyDamage, showDialogue, x, y) {
  applyDamage(player, 1);
  applyStatus(player, 'weakened', 3);
  showDialogue('Shadows coil around you, draining your strength.');
  reveal(x, y);
}

export function triggerFireTrap(player, applyDamage, showDialogue, x, y) {
  applyDamage(player, 2);
  applyStatus(player, 'burned', 3);
  showDialogue('Fire erupts beneath your feet!');
  reveal(x, y);
}
