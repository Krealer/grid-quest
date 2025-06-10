const sequence = ['1', '2', '3'];
const mirrorSequence = ['4', '5', '6', '6', '5', '4'];
const corruptionSequence = ['7', '8', '9'];
const state = { index: 0 };
const mirrorState = { index: 0 };
const corruptionState = { index: 0 };
import {
  solveSealPuzzle,
  isSealPuzzleSolved,
  solveMirrorPuzzle,
  isMirrorPuzzleSolved,
  solveCorruptionPuzzle,
  isCorruptionPuzzleSolved
} from './player_memory.js';

export async function stepSymbol(symbol) {
  if (!isSealPuzzleSolved()) {
    const expected = sequence[state.index];
    if (symbol === expected) {
      state.index++;
      if (state.index === sequence.length) {
        solveSealPuzzle();
      }
    } else if (sequence.includes(symbol)) {
      state.index = 0;
    }
  }

  if (!isMirrorPuzzleSolved()) {
    const expectedMirror = mirrorSequence[mirrorState.index];
    if (symbol === expectedMirror) {
      mirrorState.index++;
      if (mirrorState.index === mirrorSequence.length) {
        solveMirrorPuzzle();
      }
    } else if (mirrorSequence.includes(symbol)) {
      mirrorState.index = 0;
    }
  }

  if (!isCorruptionPuzzleSolved()) {
    const expectedCorrupt = corruptionSequence[corruptionState.index];
    if (symbol === expectedCorrupt) {
      corruptionState.index++;
      if (corruptionState.index === corruptionSequence.length) {
        solveCorruptionPuzzle();
        const { clearCorruption } = await import('./corruption_state.js');
        clearCorruption();
      }
    } else if (corruptionSequence.includes(symbol)) {
      corruptionState.index = 0;
    }
  }
}
