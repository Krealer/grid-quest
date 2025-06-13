import { loadJson as loadJsonFile } from '../scripts/data_service.js';
import { showError } from '../scripts/error_prompt.js';

export async function loadJson(name) {
  const data = await loadJsonFile(`../info_data/${name}`, null);
  if (data === null) {
    showError(`Failed to load info_data/${name}`);
    return [];
  }
  return data;
}

function createEntry(obj, fields) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = obj.name || obj.title;
  details.appendChild(summary);
  const body = document.createElement('div');
  body.classList.add('info-details');
  fields.forEach((f) => {
    if (obj[f]) {
      const div = document.createElement('div');
      div.classList.add('info-row');
      div.innerHTML = `<strong>${f.replace(/_/g, ' ')}:</strong> ${Array.isArray(obj[f]) ? obj[f].join(', ') : obj[f]}`;
      body.appendChild(div);
    }
  });
  details.appendChild(body);
  return details;
}

async function populate(section, file, fields) {
  const container = document.getElementById(section);
  if (!container) return;
  const data = await loadJson(file);
  container.innerHTML = '';
  data.forEach((e) => container.appendChild(createEntry(e, fields)));
}

export async function updateInfoMenu() {
  await populate('content-enemies', 'enemies.json', [
    'locations',
    'drops',
    'skills',
    'weaknesses',
    'resistances'
  ]);
  await populate('content-items', 'items.json', [
    'description',
    'type',
    'obtained',
    'functionality'
  ]);
  await populate('content-skills', 'skills.json', [
    'type',
    'effect',
    'cooldown',
    'origin'
  ]);
  await populate('content-status', 'status.json', [
    'type',
    'description',
    'duration',
    'inflicted_by',
    'cured_by'
  ]);
  await populate('content-lore', 'lore.json', ['location', 'text', 'source']);
}

function showSection(target) {
  document.querySelectorAll('#info-menu .info-nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });
  document.querySelectorAll('#info-menu .info-section').forEach((sec) => {
    sec.style.display = sec.id === `content-${target}` ? 'block' : 'none';
  });
}

export function initInfoMenu() {
  document.querySelectorAll('#info-menu .info-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => showSection(btn.dataset.target));
  });
  const close = document.querySelector('#info-menu .close-btn');
  if (close) close.addEventListener('click', toggleInfoMenu);
  const overlay = document.getElementById('info-overlay');
  if (overlay)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) toggleInfoMenu();
    });
}

export async function toggleInfoMenu() {
  const overlay = document.getElementById('info-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    await updateInfoMenu();
    overlay.classList.add('active');
    showSection('enemies');
  }
}
