import { player } from '../player.js';
import { getAllPassives } from '../passive_skills.js';
import { getItemData } from '../item_loader.js';
import { getItemDisplayName, getItemLevel } from '../inventory.js';
import { getItemBonuses } from '../item_stats.js';
import { showItemTooltip, hideItemTooltip } from '../utils.js';
import { t } from '../i18n.js';

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
    let display = 'None';
    let level = 0;
    if (id) {
      display = getItemDisplayName(id);
      level = getItemLevel(id);
    }
    row.innerHTML = `${slot.charAt(0).toUpperCase() + slot.slice(1)}: <span>${display}</span>`;
    if (level > 0) {
      row.querySelector('span').classList.add('gear-upgraded');
    }
    const bonus = id ? getItemBonuses(id) : null;
    let tooltip = '';
    if (bonus) {
      const effects = [];
      Object.keys(bonus).forEach(k => {
        if (k === 'slot') return;
        effects.push(`${k.charAt(0).toUpperCase() + k.slice(1)} +${bonus[k]}`);
      });
      tooltip = effects.join(', ');
    }
    if (tooltip) {
      row.addEventListener('mouseenter', () => showItemTooltip(row, tooltip));
      row.addEventListener('mouseleave', hideItemTooltip);
    }
    equipList.appendChild(row);
  });
  if (player.hasTemplePassive) {
    const row = document.createElement('div');
    row.classList.add('status-equip');
    row.innerHTML = '<strong>Set Bonus:</strong> Temple Harmony';
    row.addEventListener('mouseenter', () =>
      showItemTooltip(row, 'Counter 2 dmg and heal 1 HP when hit')
    );
    row.addEventListener('mouseleave', hideItemTooltip);
    equipList.appendChild(row);
  }
  info.textContent = `${t('player.lvl')}: ${player.level}  XP: ${player.xp}/${player.xpToNextLevel}`;
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
document.addEventListener('playerHpChanged', updateStatusPanel);
document.addEventListener('playerXpChanged', updateStatusPanel);
document.addEventListener('playerLevelUp', updateStatusPanel);
document.addEventListener('equipmentChanged', updateStatusPanel);
document.addEventListener('equipmentCrafted', updateStatusPanel);
