export function executeSkill(skill, caster, targets, context = {}) {
  if (!skill || typeof skill.effect !== 'function') return;
  const list = Array.isArray(targets) ? targets : targets ? [targets] : [];
  return skill.effect({
    caster,
    user: caster,
    targets: list,
    target: list[0] || null,
    ...context
  });
}
