export { addStatus as applyEffect, removeStatus } from './statusManager.js';
import { getStatusEffect } from './status_effects.js';

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
        `${who} suffer${target.isPlayer ? '' : 's'} ${dmg} ${st.id.replace('_', ' ')} damage.`
      );
    }
    st.remaining -= 1;
    if (st.remaining <= 0) {
      if (def.remove) def.remove(target);
      target.statuses.splice(i, 1);
      if (typeof log === 'function') {
        const who = target.isPlayer ? 'You' : target.name || 'Enemy';
        log(`${def.name || st.id} fades from ${who}.`);
      }
    }
  }
}
