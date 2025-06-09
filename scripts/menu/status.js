import { player } from '../player.js';
import { getAllPassives } from '../passive_skills.js';

export function updateStatusPanel() {
  const list = document.getElementById('status-passives');
  const info = document.getElementById('status-info');
  if (!list || !info) return;
  const defs = getAllPassives();
  list.innerHTML = '';
  info.textContent = `Level: ${player.level}  XP: ${player.xp}/${player.xpToNextLevel}`;
  (player.passives || []).forEach(id => {
    const p = defs[id];
    if (!p) return;
    const row = document.createElement('div');
    row.classList.add('status-passive');
    row.innerHTML = `<strong>${p.name}</strong><div class="desc">${p.description}</div>`;
    list.appendChild(row);
  });
  if ((player.passives || []).length === 0) {
    list.innerHTML = '<em>No passive skills</em>';
  }
}

export function toggleStatusPanel() {
  const overlay = document.getElementById('status-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    updateStatusPanel();
    overlay.classList.add('active');
  }
}

document.addEventListener('passivesUpdated', updateStatusPanel);
document.addEventListener('playerXpChanged', updateStatusPanel);
document.addEventListener('playerLevelUp', updateStatusPanel);
