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

export function highlightTiles(entities = [], onClick) {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  const list = Array.isArray(entities) ? entities : [entities];
  list.forEach((e) => {
    if (!e) return;
    const selector = `.tile[data-x="${e.x}"][data-y="${e.y}"]`;
    const tile = grid.querySelector(selector);
    if (!tile) return;
    tile.classList.add('highlight-tile');
    if (typeof onClick === 'function') {
      tile.classList.add('clickable-target');
      tile.addEventListener('click', () => onClick(e), { once: true });
    }
  });
}

export function clearHighlightedTiles() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  grid.querySelectorAll('.tile.highlight-tile').forEach((tile) => {
    tile.classList.remove('highlight-tile', 'clickable-target');
    const clone = tile.cloneNode(true);
    tile.replaceWith(clone);
  });
}
