import { appendLog } from '../scripts/combat_ui.js';

let logRoot = null;

export function initCombatLog(root) {
  if (!root) return;
  let el = root.querySelector('#combat-log');
  if (!el) {
    el = document.createElement('div');
    el.id = 'combat-log';
    el.className = 'combat-log';
    root.appendChild(el);
  }
  el.innerHTML = '';
  logRoot = el;
}

export function combatLog(message, type = 'system') {
  if (logRoot) appendLog(message, type);
}
