import { getStatusEffect } from './status_effects.js';
import { getStatusList } from './statusManager.js';
import { attachTooltip } from '../ui/skillsPanel.js';

export function setupTabs(overlay) {
  const offContainer = overlay.querySelector('.offensive-skill-buttons');
  const defContainer = overlay.querySelector('.defensive-skill-buttons');
  const itemContainer = overlay.querySelector('.item-buttons');
  const offTabBtn = overlay.querySelector('.offensive-tab');
  const defTabBtn = overlay.querySelector('.defensive-tab');
  const itemsTabBtn = overlay.querySelector('.items-tab');
  if (
    !offContainer ||
    !defContainer ||
    !itemContainer ||
    !offTabBtn ||
    !defTabBtn ||
    !itemsTabBtn
  )
    return;

  function showOffensive() {
    offContainer.classList.remove('hidden');
    defContainer.classList.add('hidden');
    itemContainer.classList.add('hidden');
    offTabBtn.classList.add('selected');
    defTabBtn.classList.remove('selected');
    itemsTabBtn.classList.remove('selected');
  }

  function showDefensive() {
    defContainer.classList.remove('hidden');
    offContainer.classList.add('hidden');
    itemContainer.classList.add('hidden');
    defTabBtn.classList.add('selected');
    offTabBtn.classList.remove('selected');
    itemsTabBtn.classList.remove('selected');
  }

  function showItems() {
    itemContainer.classList.remove('hidden');
    offContainer.classList.add('hidden');
    defContainer.classList.add('hidden');
    itemsTabBtn.classList.add('selected');
    offTabBtn.classList.remove('selected');
    defTabBtn.classList.remove('selected');
  }

  offTabBtn.addEventListener('click', showOffensive);
  defTabBtn.addEventListener('click', showDefensive);
  itemsTabBtn.addEventListener('click', showItems);

  // default
  showOffensive();
}

export function updateStatusUI(overlay, player, enemy) {
  const playerList = overlay.querySelector('.player-statuses');
  const enemyList = overlay.querySelector('.enemy-statuses');
  if (!playerList || !enemyList) return;
  playerList.innerHTML = '';
  enemyList.innerHTML = '';
  getStatusList(player).forEach((s) => {
    const ef = getStatusEffect(s.id);
    const span = document.createElement('span');
    span.className = 'effect';
    span.title = ef?.description || s.id;
    const icon = ef?.icon ? `${ef.icon} ` : '';
    span.textContent = `${icon}${ef?.name || s.id} (${s.remaining})`;
    playerList.appendChild(span);
  });
  getStatusList(enemy).forEach((s) => {
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
  if (!container) return {};
  container.innerHTML = '';
  const map = {};
  skills.forEach((skill) => {
    const btn = document.createElement('button');
    const effects = [];
    if (Array.isArray(skill.statuses)) {
      skill.statuses.forEach((s) => {
        const ef = getStatusEffect(s.id);
        if (ef) effects.push(ef.description);
      });
    }
    if (Array.isArray(skill.cleanse)) {
      const names = skill.cleanse
        .map((id) => getStatusEffect(id)?.name || id)
        .join(', ');
      effects.push(`Removes ${names}`);
    }
    const meta = [];
    if (typeof skill.cost === 'number' && skill.cost > 0)
      meta.push(`Cost: ${skill.cost}`);
    if (typeof skill.cooldown === 'number' && skill.cooldown > 0)
      meta.push(`Cooldown: ${skill.cooldown}`);
    const descParts = [skill.description, ...effects, ...meta]
      .filter(Boolean)
      .join(' ');
    const icon = skill.icon ? `${skill.icon} ` : '';
    btn.innerHTML = `<strong>${icon}${skill.name}</strong><div class="desc">${descParts}</div>`;
    btn.addEventListener('click', () => onClick(skill));
    attachTooltip(btn, skill);
    container.appendChild(btn);
    map[skill.id] = btn;
  });
  return map;
}

export function setSkillDisabledState(buttonMap, skillLookup, isSilenced) {
  Object.entries(buttonMap).forEach(([id, btn]) => {
    if (!btn) return;
    const def = skillLookup[id];
    const offensive = def?.category === 'offensive';
    if (isSilenced && offensive) {
      btn.classList.add('disabled');
      btn.disabled = true;
    } else {
      btn.classList.remove('disabled');
      btn.disabled = false;
    }
  });
}

let logContainer = null;

// Initialize the combat log panel and return a convenience log function.
export function initLogPanel(overlay) {
  logContainer = overlay.querySelector('.log');
  if (logContainer) {
    logContainer.innerHTML = '';
  }
  document.addEventListener('passiveUnlocked', onPassiveUnlocked);
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

export function showXpGain(amount) {
  appendLog(`Gained ${amount} XP`);
}

export function showLevelUp(level) {
  appendLog(`Level Up! Now level ${level}`);
}

function onPassiveUnlocked(e) {
  const name = e.detail?.name || e.detail?.id || 'Passive';
  appendLog(`Passive unlocked: ${name}`);
}
