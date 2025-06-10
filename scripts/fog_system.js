let cols = 0;
let container = null;
let active = false;
const revealed = new Set();

document.addEventListener('playerMoved', (e) => {
  const { x, y } = e.detail || {};
  if (typeof x === 'number' && typeof y === 'number') {
    reveal(x, y);
  }
});

export function initFog(gridContainer, colsCount, enable = false) {
  container = gridContainer;
  cols = colsCount;
  active = enable;
  revealed.clear();
  if (!container) return;
  container.querySelectorAll('.tile').forEach((tile) => {
    if (active) {
      tile.classList.add('fog-hidden');
    } else {
      tile.classList.remove('fog-hidden');
    }
  });
}

export function revealAll() {
  if (!container || !active) return;
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
  if (!container || !active) return;
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
  if (!active) return true;
  const key = `${x},${y}`;
  return revealed.has(key);
}

export function isFogActive() {
  return active;
}
