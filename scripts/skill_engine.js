export function executeSkill(skill, user, target, context = {}) {
  if (!skill || typeof skill.effect !== 'function') return;
  return skill.effect({ user, target, ...context });
}
