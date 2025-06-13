import { getStatusEffect } from './status_effects.js';
import { getStatusList } from './statusManager.js';
import { attachTooltip } from '../ui/skillsPanel.js';

export function renderCombatants(root, players = [], enemies = [], onSelect) {
  if (!root) return;
  root.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'combatants';
  const playerSide = document.createElement('div');
  playerSide.className = 'player-team';
  const enemySide = document.createElement('div');
  enemySide.className = 'enemy-team';

  players.forEach((p, idx) => {
    const el = createCombatantEl(p, true, idx);
    playerSide.appendChild(el);
  });
  enemies.forEach((e, idx) => {
    const el = createCombatantEl(e, false, idx);
    if (typeof onSelect === 'function') {
      el.classList.add('selectable');
      el.addEventListener('click', () => onSelect(e, idx, el));
    }
    enemySide.appendChild(el);
  });

  container.appendChild(playerSide);
  container.appendChild(enemySide);
  root.appendChild(container);
}

function formatStats(entity) {
  const atk = entity.stats?.attack ?? entity.atk ?? 0;
  const def = entity.stats?.defense ?? entity.def ?? 0;
  const spd = entity.stats?.speed ?? 0;
  const hp = `${entity.hp}/${entity.maxHp ?? entity.hp}`;
  return `HP: ${hp} | ATK: ${atk} | DEF: ${def} | SPD: ${spd}`;
}

function createCombatantEl(entity, isPlayer, index) {
  const wrapper = document.createElement('div');
  wrapper.className = `combatant ${isPlayer ? 'player' : 'enemy'}`;
  wrapper.dataset.index = index;
  if (entity.portrait) {
    const portrait = document.createElement('div');
    portrait.className = 'portrait';
    portrait.textContent = entity.portrait;
    wrapper.appendChild(portrait);
  }
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = entity.name || (isPlayer ? 'Player' : 'Enemy');
  wrapper.appendChild(name);
  const hpBar = document.createElement('div');
  hpBar.className = 'hp-bar';
  hpBar.innerHTML = '<div class="hp"></div>';
  wrapper.appendChild(hpBar);
  const stats = document.createElement('div');
  stats.className = 'stats';
  stats.textContent = formatStats(entity);
  wrapper.appendChild(stats);
  const status = document.createElement('div');
  status.className = 'statuses status-effects';
  wrapper.appendChild(status);
  return wrapper;
}

export function highlightActing(root, isPlayer, index) {
  if (!root) return;
  const group = root.querySelectorAll(
    isPlayer ? '.player-team .combatant' : '.enemy-team .combatant'
  );
  group.forEach((el) => {
    const match = Number(el.dataset.index) === index;
    if (match) el.classList.add('acting');
    else el.classList.remove('acting');
  });
}

export function highlightTarget(root, isPlayer, index) {
  if (!root) return;
  const group = root.querySelectorAll(
    isPlayer ? '.player-team .combatant' : '.enemy-team .combatant'
  );
  group.forEach((el) => {
    const match = Number(el.dataset.index) === index;
    if (match) el.classList.add('targeted');
    else el.classList.remove('targeted');
  });
}

export function enableEnemyTargeting(root, onSelect) {
  if (!root) return;
  const enemyEls = root.querySelectorAll('.enemy-team .combatant');
  enemyEls.forEach((el) => {
    el.classList.add('selectable');
    const idx = Number(el.dataset.index);
    const handler = () => onSelect?.(idx, el);
    el.addEventListener('click', handler, { once: true });
  });
}

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

export function updateStatusUI(root, players, enemies) {
  if (!root) return;
  const playerEls = root.querySelectorAll('.player-team .combatant');
  const enemyEls = root.querySelectorAll('.enemy-team .combatant');
  const pList = Array.isArray(players) ? players : [players];
  const eList = Array.isArray(enemies) ? enemies : [enemies];
  const update = (el, unit) => {
    if (!el || !unit) return;
    const hp = el.querySelector('.hp');
    if (hp && unit.maxHp)
      hp.style.width = `${(unit.hp / unit.maxHp) * 100}%`;
    const statsEl = el.querySelector('.stats');
    if (statsEl) statsEl.textContent = formatStats(unit);
    const list = el.querySelector('.statuses');
    if (!list) return;
    list.innerHTML = '';
    getStatusList(unit).forEach((s) => {
      const ef = getStatusEffect(s.id);
      const span = document.createElement('span');
      span.className = 'effect';
      span.title = ef?.description || s.id;
      const icon = ef?.icon ? `${ef.icon} ` : '';
      span.textContent = `${icon}${ef?.name || s.id} (${s.remaining})`;
      list.appendChild(span);
    });
  };
  pList.forEach((p, i) => update(playerEls[i], p));
  eList.forEach((e, i) => update(enemyEls[i], e));
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

export function setSkillDisabledState(
  buttonMap,
  skillLookup,
  isSilenced,
  cooldowns = {}
) {
  Object.entries(buttonMap).forEach(([id, btn]) => {
    if (!btn) return;
    const def = skillLookup[id];
    const offensive = def?.category === 'offensive';
    const exempt = def?.silenceExempt;
    if ((isSilenced && offensive && !exempt) || cooldowns[id] > 0) {
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
