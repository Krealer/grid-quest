const sequence = ['1','2','3'];
const state = {
  index: 0
};
import { solveSealPuzzle, isSealPuzzleSolved } from './player_memory.js';

export function stepSymbol(symbol) {
  if (isSealPuzzleSolved()) return;
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
