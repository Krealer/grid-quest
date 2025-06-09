import { showError } from './errorPrompt.js';
import {
  markForkVisited,
  visitedBothForks,
  hasSealingDust,
  consumeSealingDust,
  isSealPuzzleSolved,
  isMirrorPuzzleSolved
} from './player_memory.js';
import { showDialogue } from './dialogueSystem.js';

let currentGrid = null;
let currentEnvironment = 'clear';

export function normalizeGrid(grid, size = 20) {
  const normalized = [];
  for (let y = 0; y < size; y++) {
    const row = grid[y] || [];
    const paddedRow = row
      .slice(0, size)
      .map((cell) => (typeof cell === 'string' ? { type: cell } : cell));
    for (let i = paddedRow.length; i < size; i++) {
      paddedRow.push({ type: 'G' });
    }
    normalized.push(paddedRow);
  }
  return normalized;
}

export async function loadMap(name) {
  if (name === 'map09' && !hasSealingDust() && !isSealPuzzleSolved()) {
    showDialogue('A shimmering seal bars your way.');
    return null;
  }
  if (name === 'map10' && !isMirrorPuzzleSolved()) {
    showDialogue('Ancient glyphs refuse to yield.');
    return null;
  }
  let data;
  try {
    const response = await fetch(`data/maps/${name}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load map ${name}`);
    }
    data = await response.json();
    if (name === 'map06_left') markForkVisited('left');
    if (name === 'map06_right') markForkVisited('right');
    if (name === 'map07' && visitedBothForks()) {
      showDialogue('The air hums as the twin trials align.');
    }
    if (name === 'map09' && hasSealingDust()) {
      consumeSealingDust();
    }
  } catch (err) {
    console.error(err);
    showError(`Failed to load map ${name}`);
    throw err;
  }
  currentEnvironment = data.environment || 'clear';
  currentGrid = data.grid.map((row) => {
    if (typeof row === 'string') {
      return row.split('').map((ch) => ({ type: ch }));
    }
    return row.map((cell) => {
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

// After a class is chosen, send the player to that class's trial map
document.addEventListener('classChosen', async (e) => {
  const id = e?.detail?.id;
  if (!id) return;
  const { movePlayerTo } = await import('./map.js');
  await movePlayerTo(`map_${id}`, { x: 1, y: 1 });
});

// When a trial is completed, send the player back to the central hub
document.addEventListener('exitTrial', async () => {
  const { movePlayerTo } = await import('./map.js');
  await movePlayerTo('map04', { x: 10, y: 10 });
});

document.addEventListener('goFork', async () => {
  const { movePlayerTo } = await import('./map.js');
  await movePlayerTo('map05', { x: 1, y: 1 });
});

document.addEventListener('goLeftPath', async () => {
  const { movePlayerTo } = await import('./map.js');
  await movePlayerTo('map06_left', { x: 1, y: 1 });
});

document.addEventListener('goRightPath', async () => {
  const { movePlayerTo } = await import('./map.js');
  await movePlayerTo('map06_right', { x: 1, y: 1 });
});

document.addEventListener('goConvergence', async () => {
  const { movePlayerTo } = await import('./map.js');
  await movePlayerTo('map07', { x: 1, y: 1 });
});
