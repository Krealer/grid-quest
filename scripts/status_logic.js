import { applyEffect, removeStatus } from './status_effect.js';
import { removeNegativeStatus } from './status_manager.js';
import { t } from './i18n.js';

export function applyStatusLogged(target, id, duration = 1, log) {
  applyEffect(target, id, duration);
  if (typeof log === 'function') {
    const name = t(`status.${id}`);
    const who = target.isPlayer ? 'Player' : target.name || 'Enemy';
    log(t('combat.status.apply', { target: who, status: name, turns: duration }));
  }
}

export function removeStatusLogged(target, id, log) {
  removeStatus(target, id);
  if (typeof log === 'function') {
    const name = t(`status.${id}`);
    const who = target.isPlayer ? 'Player' : target.name || 'Enemy';
    log(t('combat.status.expire', { status: name, target: who }));
  }
}

export function removeNegativeStatusLogged(target, ids, log) {
  const removed = removeNegativeStatus(target, ids);
  if (typeof log === 'function') {
    removed.forEach((r) => {
      const name = t(`status.${r}`);
      const who = target.isPlayer ? 'Player' : target.name || 'Enemy';
      log(t('combat.status.expire', { status: name, target: who }));
    });
  }
  return removed;
}
