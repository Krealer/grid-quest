import { applyStatus } from './status_effects.js';
import { applyDamage } from './logic.js';

export function executeSkill(skill, caster, targets, context = {}) {
  if (!skill || typeof skill.effect !== 'function') return;
  const list = Array.isArray(targets) ? targets : targets ? [targets] : [];
  const damageTarget = (t, amt) => applyDamage(t, amt);
  const apply = (t, id, dur) => applyStatus(t, id, dur);
  const healTarget = (t, amt) => {
    if (!t) return 0;
    const max = t.maxHp ?? t.hp;
    const heal = Math.min(amt, max - t.hp);
    t.hp += heal;
    return heal;
  };
  return skill.effect({
    caster,
    user: caster,
    enemy: caster,
    player: list[0] || null,
    targets: list,
    target: list[0] || null,
    damageTarget,
    healTarget,
    damagePlayer: damageTarget,
    damageEnemy: damageTarget,
    healPlayer: healTarget,
    applyStatus: apply,
    ...context
  });
}
