/** @jest-environment jsdom */
import { updateHpBar } from '../scripts/combat_ui_helpers.js';

test('updateHpBar sets style width correctly', () => {
  const bar = document.createElement('div');
  updateHpBar(bar, 25, 100);
  expect(bar.style.width).toBe('25%');
});
