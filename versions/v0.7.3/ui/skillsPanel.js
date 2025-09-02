import { showItemTooltip, hideItemTooltip } from '../scripts/utils.js';

export function attachTooltip(button, skill) {
  if (!button || !skill) return;
  const parts = [skill.description];
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
