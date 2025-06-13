import { player, getTotalStats } from './player.js';

const STORAGE_KEY = 'gridquest.player_state';

const state = {
  relicSlots: 1,
  portal15Unlocked: false
};

function load() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const data = JSON.parse(json);
    if (typeof data.relicSlots === 'number') state.relicSlots = data.relicSlots;
    if (typeof data.portal15Unlocked === 'boolean')
      state.portal15Unlocked = data.portal15Unlocked;
  } catch {
    // ignore
  }
}

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      relicSlots: state.relicSlots,
      portal15Unlocked: state.portal15Unlocked
    })
  );
}

load();

export function getRelicSlots() {
  return state.relicSlots;
}

export function setRelicSlots(count) {
  if (typeof count === 'number' && count > 0) {
    state.relicSlots = count;
    save();
    document.dispatchEvent(
      new CustomEvent('relicSlotsChanged', {
        detail: { count: state.relicSlots }
      })
    );
  }
}

export function unlockRelicSlot() {
  if (state.relicSlots < 2) {
    setRelicSlots(2);
  }
}

export function unlockPortal15() {
  if (!state.portal15Unlocked) {
    state.portal15Unlocked = true;
    save();
    document.dispatchEvent(new CustomEvent('portal15Unlocked'));
  }
}

export function isPortal15Unlocked() {
  return state.portal15Unlocked;
}

export const playerState = state;

export function getPlayerState() {
  return {
    hp: player.hp,
    maxHp: player.maxHp,
    stats: getTotalStats(),
    level: player.level,
    xp: player.xp
  };
}
