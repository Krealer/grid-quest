import { showError } from './errorPrompt.js';
import { loadJson } from './dataService.js';
import {
  markForkVisited,
  visitedBothForks,
  hasSealingDust,
  consumeSealingDust,
  isSealPuzzleSolved,
  isMirrorPuzzleSolved,
  isCorruptionPuzzleSolved,
  isRotationPuzzleSolved,
  getEchoConversationCount,
  getIdeologyReward,
  getLoreRelicCount
} from './player_memory.js';
import { isEnemyDefeated } from './enemy.js';
import { showDialogue } from './dialogueSystem.js';
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

export async function loadMap(name) {
  if (name === 'map09' && !hasSealingDust() && !isSealPuzzleSolved()) {
    showDialogue('A shimmering seal bars your way.');
    return null;
  }
  if (name === 'map10' && !isMirrorPuzzleSolved()) {
    showDialogue('Ancient glyphs refuse to yield.');
    return null;
  }
  if (name === 'map12' && !isCorruptionPuzzleSolved()) {
    showDialogue('A malignant force repels you.');
    return null;
  }
  let data;
  try {
    if (name === 'null_room' && !hasItem('code_file')) {
      showDialogue('Obtain code file to enter.');
      return null;
    }
    data = await loadJson(`data/maps/${name}.json`);
    if (!data) {
      showError(`Failed to load map ${name}`);
      return null;
    }
    if (name === 'map06_left') markForkVisited('left');
    if (name === 'map06_right') markForkVisited('right');
    if (name === 'map07' && visitedBothForks()) {
      showDialogue('The air hums as the twin trials align.');
    }
    if (name === 'map09' && hasSealingDust()) {
      consumeSealingDust();
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
    if (name === 'map11' && isCorruptionPuzzleSolved()) {
      for (const row of data.grid) {
        for (const cell of row) {
          if (cell && cell.type === 'D' && cell.target === 'map12.json') {
            cell.locked = false;
          }
        }
      }
    }
    if (name === 'map12' && isRotationPuzzleSolved()) {
      for (const row of data.grid) {
        for (const cell of row) {
          if (
            cell &&
            cell.type === 'D' &&
            (cell.target === 'map13.json' || cell.target === 'map12.json')
          ) {
            cell.locked = false;
          }
        }
      }
    }
    if (name === 'map13' && isEnemyDefeated('whispered_mirror')) {
      for (const row of data.grid) {
        for (const cell of row) {
          if (cell && cell.type === 'D' && cell.target === 'map14.json') {
            cell.locked = false;
          }
        }
      }
    }
    if (name === 'map03' && isEnemyDefeated('scout_commander')) {
      for (const row of data.grid) {
        for (const cell of row) {
          if (cell && cell.type === 'D' && cell.target === 'map04.json') {
            cell.locked = false;
          }
        }
      }
      if (!gameState.openedChests.has('map03:10,12')) {
        if (data.grid[12] && data.grid[12][10]) {
          data.grid[12][10] = { type: 'C', glow: true };
        }
      }
    }
    if (name === 'map14' && isPortal15Unlocked()) {
      for (const row of data.grid) {
        for (const cell of row) {
          if (cell && cell.type === 'D' && cell.target === 'map15.json') {
            cell.locked = false;
          }
        }
      }
    }
    if (name === 'map15' && getEchoConversationCount() >= 2) {
      for (const row of data.grid) {
        for (const cell of row) {
          if (cell && cell.type === 'D' && cell.target === 'map16.json') {
            cell.locked = false;
          }
        }
      }
    }
    if (name === 'map15') {
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
    }
    if (name === 'map16' && getIdeologyReward() && getLoreRelicCount() >= 3) {
      for (const row of data.grid) {
        for (const cell of row) {
          if (cell && cell.type === 'D' && cell.target === 'map17.json') {
            cell.locked = false;
          }
        }
      }
    }
    if (name === 'map17' && finalFlags.bossDefeated) {
      if (data.grid[10] && data.grid[10][10]) {
        data.grid[10][10] = { type: 'N', npc: 'krealer' };
      }
    }
  } catch (err) {
    console.error(err);
    showError(err.message || `Failed to load map ${name}`);
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

// Load the Null Factor when requested
document.addEventListener('openNullRoom', async () => {
  const { movePlayerTo } = await import('./map.js');
  await movePlayerTo('null_room', { x: 1, y: 1 });
});

document.addEventListener('portal15Unlocked', () => {
  if (!currentGrid) return;
  for (const row of currentGrid) {
    for (const cell of row) {
      if (cell && cell.type === 'D' && cell.target === 'map15.json') {
        cell.locked = false;
      }
    }
  }
});

document.addEventListener('echoesUpdated', () => {
  if (!currentGrid) return;
  if (getEchoConversationCount() >= 2) {
    for (const row of currentGrid) {
      for (const cell of row) {
        if (cell && cell.type === 'D' && cell.target === 'map16.json') {
          cell.locked = false;
        }
      }
    }
  }
});
