export function triggerDarkTrap(player, applyDamage, showDialogue) {
  applyDamage(player, 2);
  showDialogue('Shadows coil around you, draining your strength.');
}

export function triggerFireTrap(player, applyDamage, showDialogue) {
  applyDamage(player, 3);
  showDialogue('Fire erupts beneath your feet!');
}
