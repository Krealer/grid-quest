export function highlightActiveUnit(overlay, unit, players = [], enemies = []) {
  if (!overlay || !unit) return;
  overlay
    .querySelectorAll('.combatant')
    .forEach((el) => el.classList.remove('acting'));
  const idx =
    unit.isPlayer || unit.isAlly
      ? players.indexOf(unit)
      : enemies.indexOf(unit);
  const selector =
    unit.isPlayer || unit.isAlly
      ? `.player-team .combatant[data-index="${idx}"]`
      : `.enemy-team .combatant[data-index="${idx}"]`;
  const el = overlay.querySelector(selector);
  if (el) el.classList.add('acting');
}

export function syncHpBars(overlay, players = [], enemies = []) {
  if (!overlay) return;
  players.forEach((p, i) => {
    const el = overlay.querySelector(
      `.player-team .combatant[data-index="${i}"] .hp`
    );
    if (el && p && p.maxHp) {
      el.style.width = `${(p.hp / p.maxHp) * 100}%`;
    }
  });
  enemies.forEach((e, i) => {
    const el = overlay.querySelector(
      `.enemy-team .combatant[data-index="${i}"] .hp`
    );
    if (el && e && e.maxHp) {
      el.style.width = `${(e.hp / e.maxHp) * 100}%`;
    }
  });
}
