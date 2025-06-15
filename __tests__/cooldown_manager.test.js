import { tickCooldowns } from '../scripts/cooldown_manager.js';

test('tickCooldowns decrements positive values', () => {
  const cds = { fire: 2, ice: 0, wind: -1 };
  tickCooldowns(cds);
  expect(cds.fire).toBe(1);
  expect(cds.ice).toBe(0);
  expect(cds.wind).toBe(-1);
});
