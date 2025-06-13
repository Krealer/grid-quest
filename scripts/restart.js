export function restartGame() {
  const keys = [
    'gridquest.state',
    'gridquest.memory',
    'gridquest.finalFlags',
    'gridquest.relics',
    'gridquest.equipped_relics',
    'gridquest.player_state',
    'gridquest.ending',
    'gridquest.lore_flags',
    'gridquest.class',
    'gridquest.passives',
    'gridquest.save'
  ];
  keys.forEach((k) => localStorage.removeItem(k));
  window.location.reload();
}

import { showConfirm } from './confirm_prompt.js';

export function confirmRestart() {
  showConfirm(
    'Are you sure you want to restart your journey? This will erase all progress, items, and unlocks.',
    restartGame,
    null,
    'Restart',
    'Cancel'
  );
}
