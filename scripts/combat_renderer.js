let previewEl = null;
let cooldownFn = () => 0;

function formatTarget(type) {
  if (!type) return 'Enemy';
  const map = {
    self: 'Self',
    enemy: 'Enemy',
    ally: 'Ally',
    all_enemies: 'All Enemies',
    all_allies: 'All Allies',
    any: 'Any'
  };
  return map[type] || type;
}

export function initSkillPreview(overlay, getCooldown) {
  previewEl = overlay.querySelector('#skill-preview');
  cooldownFn = typeof getCooldown === 'function' ? getCooldown : () => 0;
}

export function showSkillPreview(skill) {
  if (!previewEl || !skill) return;
  const remaining = cooldownFn(skill.id) || 0;
  const effects = Array.isArray(skill.statuses)
    ? skill.statuses.map((s) => s.id).join(', ')
    : '';
  previewEl.innerHTML = `\
    <strong>${skill.icon ? skill.icon + ' ' : ''}${skill.name}</strong>\
    <div class="desc">${skill.description}</div>\
    <div class="meta">Cooldown: ${skill.cooldown || 0}${remaining ? ` (Remaining: ${remaining})` : ''}</div>\
    <div class="meta">Target: ${formatTarget(skill.targeting)}</div>\
    ${effects ? `<div class="meta">Effects: ${effects}</div>` : ''}\
  `;
  previewEl.classList.remove('hidden');
}

export function hideSkillPreview() {
  if (previewEl) {
    previewEl.classList.add('hidden');
  }
}

export function initPortraitLayout(overlay) {
  if (!overlay) return;
  const mq = window.matchMedia(
    '(max-width: 768px) and (orientation: portrait)'
  );
  const update = () => {
    if (mq.matches) overlay.classList.add('portrait');
    else overlay.classList.remove('portrait');
  };
  mq.addEventListener('change', update);
  update();
}

export function injectMiniHpBars(container) {
  if (!container) return;
  container.querySelectorAll('.combatant').forEach((el) => {
    if (!el.querySelector('.hp-bar')) {
      const bar = document.createElement('div');
      bar.className = 'hp-bar';
      bar.innerHTML = '<div class="hp"></div>';
      el.appendChild(bar);
    }
  });
}
