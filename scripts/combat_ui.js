import { getStatusEffect } from './status_effects.js';

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
  (player.statuses || []).forEach(s => {
    const div = document.createElement('div');
    div.textContent = `${s.id} (${s.remaining})`;
    playerList.appendChild(div);
  });
  (enemy.statuses || []).forEach(s => {
    const div = document.createElement('div');
    div.textContent = `${s.id} (${s.remaining})`;
    enemyList.appendChild(div);
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
    const descParts = [skill.description, ...effects].filter(Boolean).join(' ');
    btn.innerHTML = `<strong>${skill.name}</strong><div class="desc">${descParts}</div>`;
    btn.addEventListener('click', () => onClick(skill));
    container.appendChild(btn);
  });
}
