import { getCurrentGrid } from './map_loader.js';
import {
  solveRotationPuzzle,
  isRotationPuzzleSolved
} from './player_memory.js';

const state = {
  A: 0,
  B: 0,
  C: 0,
  D: 0
};

const QUADRANTS = {
  A: { x: 1, y: 1 },
  B: { x: 12, y: 1 },
  C: { x: 1, y: 12 },
  D: { x: 12, y: 12 }
};
const SIZE = 7;

function rotateSubgrid(grid, sx, sy, size) {
  const temp = [];
  for (let y = 0; y < size; y++) {
    temp[y] = [];
    for (let x = 0; x < size; x++) {
      temp[y][x] = { ...grid[sy + y][sx + x] };
    }
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      grid[sy + x][sx + size - 1 - y] = temp[y][x];
    }
  }
}

export function triggerRotation(id) {
  if (!QUADRANTS[id]) return;
  const grid = getCurrentGrid();
  if (!grid) return;
  const { x, y } = QUADRANTS[id];
  rotateSubgrid(grid, x, y, SIZE);
  state[id] = (state[id] + 1) % 4;
  if (Object.values(state).every((v) => v === 0)) {
    if (!isRotationPuzzleSolved()) solveRotationPuzzle();
  }
}

export function resetRotationPuzzle() {
  state.A = state.B = state.C = state.D = 0;
}
