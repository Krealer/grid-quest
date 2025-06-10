let cols = 0;
let container = null;
const revealed = new Set();

document.addEventListener('playerMoved', (e) => {
  const { x, y } = e.detail || {};
  if (typeof x === 'number' && typeof y === 'number') {
    reveal(x, y);
  }
});

export function initFog(gridContainer, colsCount) {
  container = gridContainer;
  cols = colsCount;
  revealed.clear();
  if (!container) return;
  container.querySelectorAll('.tile').forEach((tile) => {
    tile.classList.add('fog-hidden');
  });
}

export function revealAll() {
  if (!container) return;
  container.querySelectorAll('.tile').forEach((tile) => {
    tile.classList.remove('fog-hidden');
    const x = Number(tile.dataset.x);
    const y = Number(tile.dataset.y);
    if (!Number.isNaN(x) && !Number.isNaN(y)) {
      revealed.add(`${x},${y}`);
    }
  });
}

export function reveal(x, y) {
  if (!container) return;
  const key = `${x},${y}`;
  if (revealed.has(key)) return;
  revealed.add(key);
  const index = y * cols + x;
  const tile = container.children[index];
  if (tile) {
    tile.classList.remove('fog-hidden');
  }
}

export function isRevealed(x, y) {
  const key = `${x},${y}`;
  return revealed.has(key);
}
