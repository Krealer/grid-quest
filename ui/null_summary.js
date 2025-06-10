import { npcAppearance } from '../scripts/npc_data.js';
import {
  krealer1Dialogue,
  krealer2Dialogue,
  krealer3Dialogue,
  krealer4Dialogue,
  krealer5Dialogue,
  krealer6Dialogue,
  krealer7Dialogue,
  krealer8Dialogue
} from '../scripts/dialogue_state.js';
import { hasKrealerFlag } from '../scripts/player_memory.js';

const modules = [
  { id: 'krealer1', flag: 'flag_krealer1', data: krealer1Dialogue[0] },
  { id: 'krealer2', flag: 'flag_krealer2', data: krealer2Dialogue[0] },
  { id: 'krealer3', flag: 'flag_krealer3', data: krealer3Dialogue[0] },
  { id: 'krealer4', flag: 'flag_krealer4', data: krealer4Dialogue[0] },
  { id: 'krealer5', flag: 'flag_krealer5', data: krealer5Dialogue[0] },
  { id: 'krealer6', flag: 'flag_krealer6', data: krealer6Dialogue[0] },
  { id: 'krealer7', flag: 'flag_krealer7', data: krealer7Dialogue[0] },
  { id: 'krealer8', flag: 'flag_krealer8', data: krealer8Dialogue[0] }
];

export function allKrealerFlagsSet() {
  return modules.every(m => hasKrealerFlag(m.flag));
}

export function getMissingModules() {
  return modules.filter(m => !hasKrealerFlag(m.flag)).map(m => m.id);
}

export function updateNullSummary() {
  const list = document.getElementById('null-summary-list');
  const msg = document.getElementById('null-summary-message');
  if (!list || !msg) return;
  list.innerHTML = '';
  const missing = modules.filter(m => !hasKrealerFlag(m.flag));
  if (missing.length > 0) {
    const names = missing
      .map(m => npcAppearance[m.id].displayTitle)
      .join(', ');
    msg.textContent = `Modules remaining: ${names}`;
    return;
  }
  msg.textContent = '';
  modules.forEach(m => {
    const row = document.createElement('div');
    row.classList.add('null-summary-entry');
    const title = npcAppearance[m.id].displayTitle || m.id;
    const question = m.data.text;
    const response = m.data.options && m.data.options[0]
      ? m.data.options[0].label
      : '';
    row.innerHTML = `<strong>${title}</strong><div class="question">${question}</div><div class="answer">${response}</div>`;
    list.appendChild(row);
  });
}

export function toggleNullSummary() {
  const overlay = document.getElementById('null-summary-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    updateNullSummary();
    overlay.classList.add('active');
  }
}

export function initNullSummary() {
  const overlay = document.getElementById('null-summary-overlay');
  const closeBtn = overlay?.querySelector('.close-btn');
  if (closeBtn) closeBtn.addEventListener('click', toggleNullSummary);
  if (overlay)
    overlay.addEventListener('click', e => {
      if (e.target === overlay) toggleNullSummary();
    });
}
