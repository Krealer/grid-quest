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
import { hasKrealerFlag, getKrealerFlagByPrefix } from '../scripts/player_memory.js';

const modules = [
  { id: 'krealer1', flag: 'flag_krealer1', prefix: 'k1_', dialogue: krealer1Dialogue },
  { id: 'krealer2', flag: 'flag_krealer2', prefix: 'k2_', dialogue: krealer2Dialogue },
  { id: 'krealer3', flag: 'flag_krealer3', prefix: 'k3_', dialogue: krealer3Dialogue },
  { id: 'krealer4', flag: 'flag_krealer4', prefix: 'k4_', dialogue: krealer4Dialogue },
  { id: 'krealer5', flag: 'flag_krealer5', prefix: 'k5_', dialogue: krealer5Dialogue },
  { id: 'krealer6', flag: 'flag_krealer6', prefix: 'k6_', dialogue: krealer6Dialogue },
  { id: 'krealer7', flag: 'flag_krealer7', prefix: 'k7_', dialogue: krealer7Dialogue },
  { id: 'krealer8', flag: 'flag_krealer8', prefix: 'k8_', dialogue: krealer8Dialogue }
];

export function allKrealerFlagsSet() {
  return modules.every(m => hasKrealerFlag(m.flag));
}

export function getMissingModules() {
  return modules.filter(m => !hasKrealerFlag(m.flag)).map(m => m.id);
}

function findPath(dialogue, flag, index = 0, path = []) {
  const entry = dialogue[index];
  if (!entry) return null;
  for (const opt of entry.options || []) {
    const newPath = [...path, { question: entry.text, answer: opt.label }];
    if (opt.memoryFlag === flag && (opt.goto === null || opt.goto === undefined)) {
      return newPath;
    }
    if (opt.goto !== null && opt.goto !== undefined) {
      const result = findPath(dialogue, flag, opt.goto, newPath);
      if (result) return result;
    }
  }
  return null;
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
    const branchFlag = getKrealerFlagByPrefix(m.prefix);
    const path = branchFlag ? findPath(m.dialogue, branchFlag) : null;
    let html = `<strong>${title}</strong>`;
    if (path) {
      path.forEach(step => {
        html += `<div class="question">${step.question}</div><div class="answer">${step.answer}</div>`;
      });
    }
    row.innerHTML = html;
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
