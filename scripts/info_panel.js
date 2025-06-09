import { getAllNpcs } from './npcInfo.js';
import { loadEnemyInfo, getAllEnemies } from './enemyInfo.js';
import { loadItemInfo, getAllItems } from './itemInfo.js';

function createEntry(obj) {
  const row = document.createElement('div');
  row.classList.add('info-entry');
  let extra = obj.drops ? `<div class="desc">Drops: ${obj.drops}</div>` : '';
  row.innerHTML = `<strong>${obj.name}</strong><div class="desc">${obj.description}</div>${extra}`;
  return row;
}

export async function updateInfoPanel() {
  const npcContainer = document.getElementById('info-npcs');
  const enemyContainer = document.getElementById('info-enemies');
  const itemContainer = document.getElementById('info-items');
  if (!npcContainer || !enemyContainer || !itemContainer) return;

  npcContainer.innerHTML = '';
  getAllNpcs().forEach(n => npcContainer.appendChild(createEntry(n)));

  await loadEnemyInfo();
  enemyContainer.innerHTML = '';
  getAllEnemies().forEach(e => enemyContainer.appendChild(createEntry(e)));

  await loadItemInfo();
  itemContainer.innerHTML = '';
  getAllItems().forEach(i => itemContainer.appendChild(createEntry(i)));
}

function showTab(name) {
  const tabs = document.querySelectorAll('#info-panel .info-tab-btn');
  tabs.forEach(t => {
    if (t.dataset.target === name) t.classList.add('active');
    else t.classList.remove('active');
  });
  document.getElementById('info-npcs').style.display = name === 'npcs' ? 'block' : 'none';
  document.getElementById('info-enemies').style.display = name === 'enemies' ? 'block' : 'none';
  document.getElementById('info-items').style.display = name === 'items' ? 'block' : 'none';
}

export async function toggleInfoPanel() {
  const overlay = document.getElementById('info-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    await updateInfoPanel();
    overlay.classList.add('active');
    showTab('npcs');
  }
}

export function initInfoPanel() {
  const buttons = document.querySelectorAll('#info-panel .info-tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.target));
  });
  const closeBtn = document.querySelector('#info-panel .close-btn');
  if (closeBtn) closeBtn.addEventListener('click', toggleInfoPanel);
  const overlay = document.getElementById('info-overlay');
  if (overlay) overlay.addEventListener('click', e => {
    if (e.target === overlay) toggleInfoPanel();
  });
}
