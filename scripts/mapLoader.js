let currentGrid = null;
let currentEnvironment = 'clear';

export function normalizeGrid(grid, size = 20) {
  const normalized = [];
  for (let y = 0; y < size; y++) {
    const row = grid[y] || [];
    const paddedRow = [...row.slice(0, size), ...Array(size - row.length).fill('G')];
    normalized.push(paddedRow);
  }
  return normalized;
}

export async function loadMap(name) {
  const response = await fetch(`data/maps/${name}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load map ${name}`);
  }
  const data = await response.json();
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

