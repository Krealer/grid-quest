/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let serializePlayer, deserializePlayer, player;

beforeEach(async () => {
  jest.resetModules();
  ({ serializePlayer, deserializePlayer, player } = await import('../scripts/player.js'));
});

test('negative defense persists through serialization', () => {
  player.stats.defense = -2;
  const saved = serializePlayer();
  player.stats.defense = 0;
  deserializePlayer(saved);
  expect(player.stats.defense).toBe(-2);
});
