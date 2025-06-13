import { reveal } from './fog_system.js';
import { applyStatus } from './status_manager.js';
import { gameState } from './game_state.js';

export function triggerDarkTrap(player, applyDamage, showDialogue, x, y) {
  applyDamage(player, 1);
  applyStatus(player, 'weakened', 3);
  if (!gameState.settings?.notifySkip) {
    showDialogue(
      'You step on a light trap! You take 1 damage and feel weakened.'
    );
  }
  reveal(x, y);
}

export function triggerFireTrap(player, applyDamage, showDialogue, x, y) {
  applyDamage(player, 2);
  applyStatus(player, 'burned', 3);
  if (!gameState.settings?.notifySkip) {
    showDialogue('A heavy trap burns you! 2 damage taken.');
  }
  reveal(x, y);
}
