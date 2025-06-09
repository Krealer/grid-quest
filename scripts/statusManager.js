import { getStatusEffect } from './status_effects.js';

function ensureArray(target) {
  if (!target.statuses) {
    target.statuses = [];
  }
}

export function initStatuses(target) {
  ensureArray(target);
}

export function addStatus(target, id, duration) {
  const effect = getStatusEffect(id);
  if (!effect) return;
  ensureArray(target);
  const existing = target.statuses.find(s => s.id === id);
  const dur = duration ?? effect.duration ?? 1;
  if (existing) {
    existing.remaining = Math.max(existing.remaining, dur);
    return;
  }
  const status = { id, remaining: dur };
  target.statuses.push(status);
  if (effect.remove && effect.apply) {
    effect.apply(target);
  }
}

export function removeStatus(target, id) {
  if (!target || !target.statuses) return;
  const idx = target.statuses.findIndex(s => s.id === id);
  if (idx === -1) return;
  const effect = getStatusEffect(id);
  if (effect && effect.remove) {
    effect.remove(target);
  }
  target.statuses.splice(idx, 1);
}

export function tickStatuses(target) {
  if (!target || !target.statuses) return;
  for (let i = target.statuses.length - 1; i >= 0; i--) {
    const st = target.statuses[i];
    const effect = getStatusEffect(st.id);
    if (effect && !effect.remove && effect.apply) {
      effect.apply(target);
    }
    st.remaining -= 1;
    if (st.remaining <= 0) {
      if (effect && effect.remove) {
        effect.remove(target);
      }
      target.statuses.splice(i, 1);
    }
  }
}

export function applyStatus(target, id, duration) {
  addStatus(target, id, duration);
}
