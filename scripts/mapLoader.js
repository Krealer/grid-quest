import { showError } from './errorMessage.js';

let currentGrid = null;
let currentEnvironment = 'clear';

export function normalizeGrid(grid, size = 20) {
  const normalized = [];
  for (let y = 0; y < size; y++) {
    const row = grid[y] || [];
    const paddedRow = row.slice(0, size).map(cell =>
      typeof cell === 'string' ? { type: cell } : cell
    );
    for (let i = paddedRow.length; i < size; i++) {
      paddedRow.push({ type: 'G' });
    }
    normalized.push(paddedRow);
  }
  return normalized;
}

export async function loadMap(name) {
  let data;
  try {
    const response = await fetch(`data/maps/${name}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load map ${name}`);
    }
    data = await response.json();
  } catch (err) {
    console.error('Failed to load map', err);
    showError('Failed to load map data. Please try again later.');
    throw err;
  }
  currentEnvironment = data.environment || 'clear';
  currentGrid = data.grid.map(row => {
    if (typeof row === 'string') {
      return row.split('').map(ch => ({ type: ch }));
    }
    return row.map(cell => {
      if (typeof cell === 'string') {
        return { type: cell };
      }
      return cell;
    });
  });
  currentGrid = normalizeGrid(currentGrid);
  return { grid: currentGrid, environment: currentEnvironment };
}

export function getCurrentGrid() {
  return currentGrid;
}

export function getCurrentEnvironment() {
  return currentEnvironment;
}

