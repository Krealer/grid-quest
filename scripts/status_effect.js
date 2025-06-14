export { addStatus as applyEffect, removeStatus } from './status_manager.js';
import { getStatusEffect } from './status_effects.js';
import { t } from './i18n.js';

export function tickStatusEffects(target, log) {
  if (!target || !Array.isArray(target.statuses)) return;
  for (let i = target.statuses.length - 1; i >= 0; i--) {
    const st = target.statuses[i];
    const def = getStatusEffect(st.id);
    if (!def) continue;
    const prevHp = target.hp;
    if (def.apply && !def.remove) {
      def.apply(target);
    }
    if (typeof log === 'function' && target.hp < prevHp) {
      const dmg = prevHp - target.hp;
      const who = target.isPlayer ? 'You' : target.name || 'Enemy';
      log(
        t('combat.status.damage', {
          target: who,
          amount: dmg,
          status: t(`status.${st.id}`)
        })
      );
    }
    st.remaining -= 1;
    if (st.remaining <= 0) {
      if (def.remove) def.remove(target);
      target.statuses.splice(i, 1);
      if (typeof log === 'function') {
        const who = target.isPlayer ? 'You' : target.name || 'Enemy';
        log(
          t('combat.status.expire', {
            status: t(`status.${st.id}`),
            target: who,
            turns: ''
          })
        );
      }
    }
  }
}
