let previewEl = null;
let cooldownFn = () => 0;

function formatTarget(type) {
  if (!type) return 'Enemy';
  const map = {
    self: 'Self',
    enemy: 'Enemy',
    allEnemies: 'All Enemies',
    allAllies: 'All Allies',
    ally: 'Ally'
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
    <div class="meta">Target: ${formatTarget(skill.targetType)}</div>\
    ${effects ? `<div class="meta">Effects: ${effects}</div>` : ''}\
  `;
  previewEl.classList.remove('hidden');
}

export function hideSkillPreview() {
  if (previewEl) {
    previewEl.classList.add('hidden');
  }
}
