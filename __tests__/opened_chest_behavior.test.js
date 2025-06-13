/** @jest-environment jsdom */
import { isWalkable, isInteractable } from '../scripts/tile_type.js';

it('opened chest tile behaves like a wall', () => {
  expect(isWalkable('c')).toBe(false);
  expect(isInteractable('c')).toBe(false);
});
