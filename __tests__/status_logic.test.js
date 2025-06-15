/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let applyStatusLogged,
  removeStatusLogged,
  removeNegativeStatusLogged;

beforeEach(async () => {
  jest.resetModules();
  ({
    applyStatusLogged,
    removeStatusLogged,
    removeNegativeStatusLogged
  } = await import('../scripts/status_logic.js'));
});

test('applyStatusLogged adds status and logs', () => {
  const target = { statuses: [], isPlayer: true };
  const logger = jest.fn();
  applyStatusLogged(target, 'regen', 2, logger);
  expect(target.statuses[0].id).toBe('regen');
  expect(logger).toHaveBeenCalled();
});

test('removeStatusLogged removes status and logs', () => {
  const target = { statuses: [{ id: 'regen', remaining: 1 }], isPlayer: true };
  const logger = jest.fn();
  removeStatusLogged(target, 'regen', logger);
  expect(target.statuses.length).toBe(0);
  expect(logger).toHaveBeenCalled();
});

test('removeNegativeStatusLogged removes negative statuses', () => {
  const target = {
    statuses: [
      { id: 'poisoned', remaining: 2 },
      { id: 'regen', remaining: 1 }
    ],
    isPlayer: true
  };
  const logger = jest.fn();
  const removed = removeNegativeStatusLogged(target, null, logger);
  expect(removed).toContain('poisoned');
  expect(target.statuses.length).toBe(1);
  expect(target.statuses[0].id).toBe('regen');
  expect(logger).toHaveBeenCalled();
});
