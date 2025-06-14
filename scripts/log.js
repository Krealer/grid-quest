import { log } from '../combat/combat_log.js';

export function logAction(actor, skill, target) {
  const actorName = actor?.name || actor?.id || 'Unknown';
  const skillName = skill?.name || skill?.id || 'skill';
  const targetName = target?.name || target?.id || 'Unknown';
  log(`${actorName} uses ${skillName} on ${targetName}.`);
}
