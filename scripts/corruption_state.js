import { getCurrentGrid } from './map_loader.js';
import { isRevealed } from './fog_system.js';

const state = { value: 0 };

export function getCorruption() {
  return state.value;
}

export function addCorruption(amount = 1) {
  state.value = Math.min(100, state.value + amount);
  document.dispatchEvent(
    new CustomEvent('corruptionChanged', { detail: { value: state.value } })
  );
}

export function reduceCorruption(amount = 1) {
  state.value = Math.max(0, state.value - amount);
  document.dispatchEvent(
    new CustomEvent('corruptionChanged', { detail: { value: state.value } })
  );
}

export function clearCorruption() {
  reduceCorruption(1000);
}

export function handleMoveCorruption(x, y) {
  const grid = getCurrentGrid();
  if (!grid || !grid[y] || !grid[y][x]) return;
  const tile = grid[y][x];
  if (!isRevealed(x, y) && !tile.safe) {
    addCorruption(1);
  }
}
