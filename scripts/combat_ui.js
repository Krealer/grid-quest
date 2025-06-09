import { getStatusEffect } from './status_effects.js';
import { getStatusList } from './statusManager.js';

export function setupTabs(overlay) {
  const skillContainer = overlay.querySelector('.skill-buttons');
  const itemContainer = overlay.querySelector('.item-buttons');
  const skillsTabBtn = overlay.querySelector('.skills-tab');
  const itemsTabBtn = overlay.querySelector('.items-tab');
  if (!skillContainer || !itemContainer || !skillsTabBtn || !itemsTabBtn) return;

  function showSkills() {
    skillContainer.classList.remove('hidden');
    itemContainer.classList.add('hidden');
    skillsTabBtn.classList.add('selected');
    itemsTabBtn.classList.remove('selected');
  }

  function showItems() {
    itemContainer.classList.remove('hidden');
    skillContainer.classList.add('hidden');
    itemsTabBtn.classList.add('selected');
    skillsTabBtn.classList.remove('selected');
  }

  skillsTabBtn.addEventListener('click', showSkills);
  itemsTabBtn.addEventListener('click', showItems);

  // default
  showSkills();
}

export function updateStatusUI(overlay, player, enemy) {
  const playerList = overlay.querySelector('.player-statuses');
  const enemyList = overlay.querySelector('.enemy-statuses');
  if (!playerList || !enemyList) return;
  playerList.innerHTML = '';
  enemyList.innerHTML = '';
  getStatusList(player).forEach(s => {
    const ef = getStatusEffect(s.id);
    const span = document.createElement('span');
    span.className = 'effect';
    span.title = ef?.description || s.id;
    const icon = ef?.icon ? `${ef.icon} ` : '';
    span.textContent = `${icon}${ef?.name || s.id} (${s.remaining})`;
    playerList.appendChild(span);
  });
  getStatusList(enemy).forEach(s => {
    const ef = getStatusEffect(s.id);
    const span = document.createElement('span');
    span.className = 'effect';
    span.title = ef?.description || s.id;
    const icon = ef?.icon ? `${ef.icon} ` : '';
    span.textContent = `${icon}${ef?.name || s.id} (${s.remaining})`;
    enemyList.appendChild(span);
  });
}

export function renderSkillList(container, skills, onClick) {
  if (!container) return;
  container.innerHTML = '';
  skills.forEach(skill => {
    const btn = document.createElement('button');
    const effects = [];
    if (Array.isArray(skill.statuses)) {
      skill.statuses.forEach(s => {
        const ef = getStatusEffect(s.id);
        if (ef) effects.push(ef.description);
      });
    }
    if (Array.isArray(skill.cleanse)) {
      const names = skill.cleanse
        .map(id => getStatusEffect(id)?.name || id)
        .join(', ');
      effects.push(`Removes ${names}`);
    }
    const descParts = [skill.description, ...effects].filter(Boolean).join(' ');
    btn.innerHTML = `<strong>${skill.name}</strong><div class="desc">${descParts}</div>`;
    btn.addEventListener('click', () => onClick(skill));
    container.appendChild(btn);
  });
}

let logContainer = null;

// Initialize the combat log panel and return a convenience log function.
export function initLogPanel(overlay) {
  logContainer = overlay.querySelector('.log');
  if (logContainer) {
    logContainer.innerHTML = '';
  }
  return appendLog;
}

// Append a single entry to the combat log panel.
export function appendLog(message) {
  if (!logContainer) return;
  const entry = document.createElement('div');
  entry.textContent = message;
  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

export function showVictoryMessage() {
  appendLog('Victory!');
}
