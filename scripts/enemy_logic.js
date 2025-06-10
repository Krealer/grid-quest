export function isElite(enemy) {
  return enemy?.type === 'elite';
}

export function isBoss(enemy) {
  return enemy?.boss === true;
}

import {
  applyEffect,
  tickStatusEffects,
  removeStatus
} from './status_effect.js';

export function applyEnemyStatus(enemy, id, duration) {
  applyEffect(enemy, id, duration);
}

export function tickEnemyStatuses(enemy, log) {
  tickStatusEffects(enemy, log);
}

export function removeEnemyStatus(enemy, id) {
  removeStatus(enemy, id);
}
