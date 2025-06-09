const sequence = ['1', '2', '3'];
const mirrorSequence = ['4', '5', '6', '6', '5', '4'];
const state = { index: 0 };
const mirrorState = { index: 0 };
import {
  solveSealPuzzle,
  isSealPuzzleSolved,
  solveMirrorPuzzle,
  isMirrorPuzzleSolved
} from './player_memory.js';

export function stepSymbol(symbol) {
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
}
