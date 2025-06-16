/** @jest-environment jsdom */
import { isWalkable, isInteractable } from '../scripts/tile_type.js';

it('opened chest tile remains blocked but interactable', () => {
  expect(isWalkable('c')).toBe(false);
  expect(isInteractable('c')).toBe(true);
});
