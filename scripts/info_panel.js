import { getAllNpcs } from './npcInfo.js';
import { loadEnemyInfo, getAllEnemies } from './enemyInfo.js';
import { loadItemInfo, getAllItems } from './itemInfo.js';
import { getDiscovered } from './player_memory.js';
import { getAllSkillsInfo } from './skillsInfo.js';
import { getStatusMetadata } from './status_effects.js';
import { getLoreEntries } from './lore_entries.js';
import { getAllClasses } from './classesInfo.js';
import { getChosenClass } from './class_state.js';
import { loadRelics, getRelicData, getOwnedRelics } from './relic_state.js';

function createEntry(obj) {
  const row = document.createElement('div');
  row.classList.add('info-entry');
  let extra = obj.drops ? `<div class="desc">Drops: ${obj.drops}</div>` : '';
  if (obj.effects) {
    extra += `<div class="desc">Effect: ${obj.effects}</div>`;
  }
  row.innerHTML = `<strong>${obj.name}</strong><div class="desc">${obj.description}</div>${extra}`;
  return row;
}

function createSkillEntry(skill) {
  const row = document.createElement('div');
  row.classList.add('info-entry', 'skill-entry');
  row.innerHTML = `
    <strong>${skill.name}</strong>
    <div class="desc">${skill.description}</div>
    <div class="meta">${skill.type} - ${skill.origin}</div>`;
  return row;
}

function createStatusEntry(effect) {
  const row = document.createElement('div');
  row.classList.add('info-entry', effect.type);
  const durationLabel = effect.temporary ? 'Temporary' : 'Passive';
  row.innerHTML = `
    <strong>${effect.name}</strong>
    <div class="desc">${effect.description}</div>
    <div class="meta">${durationLabel}</div>`;
  return row;
}

function createClassEntry(cls, chosen) {
  const row = document.createElement('div');
  row.classList.add('info-entry', 'class-entry');
  if (chosen) row.classList.add('selected');
  const bonus = Object.entries(cls.bonuses || {})
    .map(([k, v]) => `${k} +${v}`)
    .join(', ');
  row.innerHTML = `
    <strong>${cls.name}</strong>
    <div class="desc">${cls.description}</div>
    <div class="meta">${bonus}</div>`;
  return row;
}

function createRelicEntry(relic) {
  const row = document.createElement('div');
  row.classList.add('info-entry', 'relic-entry');
  row.innerHTML = `<strong>${relic.name}</strong><div class="desc">${relic.description}</div>`;
  return row;
}

export async function updateInfoPanel() {
  const npcContainer = document.getElementById('info-npcs');
  const enemyContainer = document.getElementById('info-enemies');
  const itemContainer = document.getElementById('info-items');
  const skillContainer = document.getElementById('info-skills');
  const statusContainer = document.getElementById('info-status');
  const loreContainer = document.getElementById('info-lore');
  const relicContainer = document.getElementById('info-relics');
  const classContainer = document.getElementById('info-class');
  if (
    !npcContainer ||
    !enemyContainer ||
    !itemContainer ||
    !skillContainer ||
    !statusContainer ||
    !loreContainer ||
    !relicContainer ||
    !classContainer
  )
    return;

  npcContainer.innerHTML = '';
  const seenNpcs = getDiscovered('npcs');
  if (seenNpcs.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = "You haven't met any NPCs yet.";
    npcContainer.appendChild(msg);
  } else {
    const all = getAllNpcs();
    seenNpcs.forEach((id) => {
      const data = all.find((n) => n.id === id);
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
    seenEnemies.forEach((id) => {
      const data = all.find((e) => e.id === id);
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
    seenItems.forEach((id) => {
      const data = all.find((i) => i.id === id);
      if (data) itemContainer.appendChild(createEntry(data));
    });
  }

  await loadRelics();
  relicContainer.innerHTML = '';
  const ownedRelics = getOwnedRelics();
  if (ownedRelics.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = 'No relics found yet.';
    relicContainer.appendChild(msg);
  } else {
    ownedRelics.forEach((id) => {
      const data = getRelicData(id);
      if (data) relicContainer.appendChild(createRelicEntry(data));
    });
  }

  skillContainer.innerHTML = '';
  const seenSkills = getDiscovered('skills');
  if (seenSkills.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = 'No skills discovered yet.';
    skillContainer.appendChild(msg);
  } else {
    const allSkills = getAllSkillsInfo();
    seenSkills.forEach((id) => {
      const data = allSkills.find((s) => s.id === id);
      if (data) skillContainer.appendChild(createSkillEntry(data));
    });
  }

  statusContainer.innerHTML = '';
  const effects = getStatusMetadata();
  const sorted = effects.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'positive' ? -1 : 1;
  });
  sorted.forEach((eff) => {
    statusContainer.appendChild(createStatusEntry(eff));
  });

  loreContainer.innerHTML = '';
  const seenLore = getDiscovered('lore');
  if (seenLore.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = 'No lore discovered yet.';
    loreContainer.appendChild(msg);
  } else {
    const allLore = getLoreEntries();
    seenLore.forEach((id) => {
      const data = allLore.find((l) => l.id === id);
      if (data) {
        const row = document.createElement('div');
        row.classList.add('info-entry', 'lore-entry');
        row.innerHTML = `<strong>${data.title}</strong><div class="desc">${data.text}</div>`;
        loreContainer.appendChild(row);
      }
    });
  }

  classContainer.innerHTML = '';
  const chosen = getChosenClass();
  const allClasses = getAllClasses();
  allClasses.forEach((cls) => {
    const entry = createClassEntry(cls, cls.id === chosen);
    classContainer.appendChild(entry);
  });
}

function showTab(name) {
  const tabs = document.querySelectorAll('#info-panel .info-tab-btn');
  tabs.forEach((t) => {
    if (t.dataset.target === name) t.classList.add('active');
    else t.classList.remove('active');
  });
  document.getElementById('info-npcs').style.display =
    name === 'npcs' ? 'block' : 'none';
  document.getElementById('info-enemies').style.display =
    name === 'enemies' ? 'block' : 'none';
  document.getElementById('info-items').style.display =
    name === 'items' ? 'block' : 'none';
  document.getElementById('info-skills').style.display =
    name === 'skills' ? 'block' : 'none';
  document.getElementById('info-relics').style.display =
    name === 'relics' ? 'block' : 'none';
  document.getElementById('info-status').style.display =
    name === 'status' ? 'block' : 'none';
  document.getElementById('info-lore').style.display =
    name === 'lore' ? 'block' : 'none';
  document.getElementById('info-class').style.display =
    name === 'class' ? 'block' : 'none';
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
  const tabsContainer = document.querySelector('#info-panel .info-tabs');
  const panel = document.getElementById('info-panel');
  if (tabsContainer && panel) {
    if (!document.getElementById('info-relics')) {
      const rbtn = document.createElement('div');
      rbtn.classList.add('info-tab-btn');
      rbtn.dataset.target = 'relics';
      rbtn.textContent = 'Relics';
      tabsContainer.appendChild(rbtn);
      const rdiv = document.createElement('div');
      rdiv.id = 'info-relics';
      rdiv.classList.add('info-tab-content');
      rdiv.style.display = 'none';
      panel.appendChild(rdiv);
    }
    if (!document.getElementById('info-class')) {
      const btn = document.createElement('div');
      btn.classList.add('info-tab-btn');
      btn.dataset.target = 'class';
      btn.textContent = 'Class';
      tabsContainer.appendChild(btn);
      const div = document.createElement('div');
      div.id = 'info-class';
      div.classList.add('info-tab-content');
      div.style.display = 'none';
      panel.appendChild(div);
    }
  }
  const buttons = document.querySelectorAll('#info-panel .info-tab-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => showTab(btn.dataset.target));
  });
  const closeBtn = document.querySelector('#info-panel .close-btn');
  if (closeBtn) closeBtn.addEventListener('click', toggleInfoPanel);
  const overlay = document.getElementById('info-overlay');
  if (overlay)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) toggleInfoPanel();
    });
  document.addEventListener('relicsUpdated', () => {
    const ov = document.getElementById('info-overlay');
    if (ov && ov.classList.contains('active')) updateInfoPanel();
  });
  document.addEventListener('memoryUpdated', (e) => {
    if (e.detail.type === 'lore') {
      const ov = document.getElementById('info-overlay');
      if (ov && ov.classList.contains('active')) updateInfoPanel();
    }
  });
}
