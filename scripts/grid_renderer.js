export function markActiveTile(entity) {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  grid.querySelectorAll('.tile.active-turn').forEach((t) =>
    t.classList.remove('active-turn')
  );
  if (!entity) return;
  const selector = `.tile[data-x="${entity.x}"][data-y="${entity.y}"]`;
  const tile = grid.querySelector(selector);
  if (tile) tile.classList.add('active-turn');
}

export function clearActiveTile() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  grid.querySelectorAll('.tile.active-turn').forEach((t) =>
    t.classList.remove('active-turn')
  );
}
