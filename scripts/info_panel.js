import { getAllNpcs } from './npcInfo.js';
import { loadEnemyInfo, getAllEnemies } from './enemyInfo.js';
import { loadItemInfo, getAllItems } from './itemInfo.js';
import { getDiscovered } from './player_memory.js';

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
  const seenNpcs = getDiscovered('npcs');
  if (seenNpcs.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = "You haven't met any NPCs yet.";
    npcContainer.appendChild(msg);
  } else {
    const all = getAllNpcs();
    seenNpcs.forEach(id => {
      const data = all.find(n => n.id === id);
      if (data) npcContainer.appendChild(createEntry(data));
    });
  }

  await loadEnemyInfo();
  enemyContainer.innerHTML = '';
  const seenEnemies = getDiscovered('enemies');
  if (seenEnemies.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = 'No enemies encountered yet.';
    enemyContainer.appendChild(msg);
  } else {
    const all = getAllEnemies();
    seenEnemies.forEach(id => {
      const data = all.find(e => e.id === id);
      if (data) enemyContainer.appendChild(createEntry(data));
    });
  }

  await loadItemInfo();
  itemContainer.innerHTML = '';
  const seenItems = getDiscovered('items');
  if (seenItems.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = 'You have not collected any items yet.';
    itemContainer.appendChild(msg);
  } else {
    const all = getAllItems();
    seenItems.forEach(id => {
      const data = all.find(i => i.id === id);
      if (data) itemContainer.appendChild(createEntry(data));
    });
  }
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
