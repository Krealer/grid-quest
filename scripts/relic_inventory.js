import { getRelicData } from './relic_state.js';
import { getRelicSlots } from './player_state.js';

const STORAGE_KEY = 'gridquest.equipped_relics';

const state = {
  equipped: new Set()
};

function load() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) state.equipped = new Set(arr);
  } catch {
    // ignore
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.equipped)));
}

load();

document.addEventListener('relicSlotsChanged', () => {
  while (state.equipped.size > getRelicSlots()) {
    const id = state.equipped.values().next().value;
    state.equipped.delete(id);
  }
  save();
  document.dispatchEvent(new CustomEvent('relicsUpdated'));
});

export function getEquippedRelics() {
  return Array.from(state.equipped);
}

export function equipRelic(id) {
  if (!id || state.equipped.has(id)) return false;
  if (state.equipped.size >= getRelicSlots()) return false;
  state.equipped.add(id);
  save();
  document.dispatchEvent(new CustomEvent('relicsUpdated'));
  return true;
}

export function unequipRelic(id) {
  if (state.equipped.has(id)) {
    state.equipped.delete(id);
    save();
    document.dispatchEvent(new CustomEvent('relicsUpdated'));
  }
}

export function getEquippedBonuses() {
  const totals = {};
  state.equipped.forEach((id) => {
    const data = getRelicData(id);
    if (data && data.bonuses) {
      Object.entries(data.bonuses).forEach(([k, v]) => {
        totals[k] = (totals[k] || 0) + v;
      });
    }
  });
  return totals;
}

export const relicInventory = state;
