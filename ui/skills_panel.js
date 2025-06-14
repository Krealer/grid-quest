import { showItemTooltip, hideItemTooltip } from '../scripts/utils.js';
import { t } from '../scripts/i18n.js';

export function attachTooltip(button, skill) {
  if (!button || !skill) return;
  const descKey = `combat.skill.${skill.id}.description`;
  const baseDesc = t(descKey);
  const parts = [baseDesc !== '[Missing Translation]' ? baseDesc : skill.description];
  if (typeof skill.cost === 'number' && skill.cost > 0) {
    parts.push(`Cost: ${skill.cost}`);
  }
  if (typeof skill.cooldown === 'number' && skill.cooldown > 0) {
    parts.push(`Cooldown: ${skill.cooldown}`);
  }
  if (Array.isArray(skill.statuses)) {
    skill.statuses.forEach((s) => {
      parts.push(`${s.id} (${s.duration})`);
    });
  }
  button.addEventListener('mouseenter', () => {
    showItemTooltip(button, parts.join(' '));
  });
  button.addEventListener('mouseleave', hideItemTooltip);
}
