import { player } from '../player.js';
import { getAllPassives } from '../passive_skills.js';
import { getItemData } from '../item_loader.js';

export function updateStatusPanel() {
  const list = document.getElementById('status-passives');
  const info = document.getElementById('status-info');
  let equipList = document.getElementById('status-equipment');
  const container = document.querySelector('#status-overlay .status-content');
  if (!list || !info || !container) return;
  if (!equipList) {
    const heading = document.createElement('h3');
    heading.textContent = 'Equipment';
    equipList = document.createElement('div');
    equipList.id = 'status-equipment';
    container.insertBefore(heading, list);
    container.insertBefore(equipList, list);
  }
  const defs = getAllPassives();
  list.innerHTML = '';
  equipList.innerHTML = '';
  const eq = player.equipment || {};
  ['weapon', 'armor', 'accessory'].forEach(slot => {
    const id = eq[slot];
    const item = id ? getItemData(id) : null;
    const row = document.createElement('div');
    row.classList.add('status-equip');
    const name = item ? item.name : 'None';
    row.textContent = `${slot.charAt(0).toUpperCase() + slot.slice(1)}: ${name}`;
    equipList.appendChild(row);
  });
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
document.addEventListener('equipmentChanged', updateStatusPanel);
