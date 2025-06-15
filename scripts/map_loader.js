import { loadJson } from './data_service.js';
import {
  markForkVisited,
  visitedBothForks,
  isMirrorPuzzleSolved,
  isCorruptionPuzzleSolved,
  isRotationPuzzleSolved,
  getEchoConversationCount,
  getIdeologyReward,
  getLoreRelicCount
} from './player_memory.js';
import { isEnemyDefeated } from './enemy.js';
import { showDialogue } from './dialogue_system.js';
import { isPortal15Unlocked } from './player_state.js';
import { finalFlags } from './memory_flags.js';
import { hasItem } from './inventory.js';
import { gameState } from './game_state.js';

let currentGrid = null;
let currentEnvironment = 'clear';
let currentProperties = {};

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

const mapEntryConditions = {
  map10: {
    check: () => isMirrorPuzzleSolved(),
    message: 'Ancient glyphs refuse to yield.'
  }
};

export async function loadMap(name) {
  const condition = mapEntryConditions[name];
  if (condition && !condition.check()) {
    showDialogue(condition.message);
    return null;
  }
  let data;
  try {
    data = await loadJson(`data/maps/${name}.json`);
    if (name === 'map06_left') markForkVisited('left');
    if (name === 'map06_right') markForkVisited('right');
    if (name === 'map07' && visitedBothForks()) {
      showDialogue('The air hums as the twin trials align.');
    }
    if (name === 'map09' && isMirrorPuzzleSolved()) {
      // Unlock the door leading to map10 once the mirror puzzle is solved
      for (const row of data.grid) {
        for (const cell of row) {
          if (cell && cell.type === 'D' && cell.target === 'map10.json') {
            cell.locked = false;
          }
        }
      }
    }
    if (name === 'map03' && isEnemyDefeated('scout_commander')) {
      if (!gameState.openedChests.has('map03:10,12')) {
        if (data.grid[12] && data.grid[12][10]) {
          data.grid[12][10] = { type: 'C', glow: true };
        }
      }
    }
      for (const row of data.grid) {
        for (const cell of row) {
          if (
            cell &&
            cell.type === 'E' &&
            cell.enemyId === 'shadow_inversion'
          ) {
            if (
              getEchoConversationCount() < 3 ||
              isEnemyDefeated('shadow_inversion')
            ) {
              cell.type = 'G';
            }
          }
        }
      }
    for (const row of data.grid) {
      for (const cell of row) {
        if (cell && cell.type === 'E' && cell.enemyId === 'warden_threshold') {
          if (isEnemyDefeated('warden_threshold')) {
            cell.type = 'G';
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
  currentEnvironment = data.environment || 'clear';
  currentProperties = data.properties || {};
  currentGrid = data.grid.map((row) => {
    if (typeof row === 'string') {
      return row.split('').map((ch) => ({ type: ch }));
    }
    return row.map((cell) => {
      if (typeof cell === 'string') {
        return { type: cell };
      }
      if (cell && ['E', 'A', 'B', 'X'].includes(cell.type)) {
        return { base: 'G', ...cell };
      }
      return cell;
    });
  });
  currentGrid = normalizeGrid(currentGrid);
  return {
    grid: currentGrid,
    environment: currentEnvironment,
    properties: currentProperties,
  };
}

export function getCurrentGrid() {
  return currentGrid;
}

export function getCurrentEnvironment() {
  return currentEnvironment;
}

export function isFogEnabled() {
  return !!currentProperties.fog;
}

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
