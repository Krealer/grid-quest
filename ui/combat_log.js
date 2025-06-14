import { appendLog } from '../scripts/combat_ui.js';

let logRoot = null;

export function initCombatLog(root) {
  logRoot = root;
}

export function combatLog(message, type = 'system') {
  if (logRoot) appendLog(message, type);
}
