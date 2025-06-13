import { getAllCombatants } from './combat_state.js';
import { getStatusEffect } from './status_effects.js';
import { getStatusList } from './status_manager.js';

export function createInspectPanel() {
  const panel = document.createElement('div');
  panel.className = 'inspect-panel collapsed';
  const toggle = document.createElement('button');
  toggle.className = 'inspect-toggle';
  toggle.textContent = '📊 Inspect';
  panel.appendChild(toggle);
  const list = document.createElement('div');
  list.className = 'inspect-list';
  panel.appendChild(list);
  toggle.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
  });

  function renderEntry(unit) {
    const wrap = document.createElement('div');
    wrap.className = 'inspect-entry';
    const stats = document.createElement('div');
    const atk = unit.stats?.attack ?? unit.atk ?? 0;
    const def = unit.stats?.defense ?? unit.def ?? 0;
    const spd = unit.stats?.speed ?? 0;
    const hp = `${unit.hp}/${unit.maxHp ?? unit.hp}`;
    stats.textContent = `${unit.name}: HP ${hp} | ATK ${atk} | DEF ${def} | SPD ${spd}`;
    wrap.appendChild(stats);
    const statusWrap = document.createElement('div');
    statusWrap.className = 'statuses';
    getStatusList(unit).forEach((s) => {
      const defn = getStatusEffect(s.id);
      const span = document.createElement('span');
      span.className = 'effect';
      span.title = defn?.description || s.id;
      const icon = defn?.icon ? `${defn.icon} ` : '';
      span.textContent = `${icon}${s.remaining}t`;
      statusWrap.appendChild(span);
    });
    wrap.appendChild(statusWrap);
    return wrap;
  }

  function update() {
    list.innerHTML = '';
    const units = getAllCombatants();
    units.forEach((u) => list.appendChild(renderEntry(u)));
  }

  return { panel, update };
}
