import { loadJson } from './dataService.js';
import { showError } from './errorPrompt.js';

const STORAGE_KEY = 'gridquest.relics';

export const relicState = {
  owned: new Set(),
  data: {}
};

function loadOwned() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveOwned(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

relicState.owned = new Set(loadOwned());

document.dispatchEvent(new CustomEvent('relicsLoaded'));

export async function loadRelics() {
  if (Object.keys(relicState.data).length) return relicState.data;
  const data = await loadJson('data/relics.json');
  if (data) {
    relicState.data = data;
  } else {
    showError('Failed to load relics');
  }
  return relicState.data;
}

export function getRelicData(id) {
  return relicState.data[id];
}

export function isRelic(id) {
  return !!relicState.data[id];
}

export function getOwnedRelics() {
  return Array.from(relicState.owned);
}

export function hasRelic(id) {
  return relicState.owned.has(id);
}

export async function addRelic(id) {
  if (!id) return;
  await loadRelics();
  if (!relicState.owned.has(id)) {
    relicState.owned.add(id);
    saveOwned(Array.from(relicState.owned));
    document.dispatchEvent(new CustomEvent('relicsUpdated'));
  }
}

export function removeRelic(id) {
  if (relicState.owned.has(id)) {
    relicState.owned.delete(id);
    saveOwned(Array.from(relicState.owned));
    document.dispatchEvent(new CustomEvent('relicsUpdated'));
  }
}

import { getEquippedRelics } from './relic_inventory.js';

export function getRelicBonuses() {
  const totals = {};
  getEquippedRelics().forEach((id) => {
    const data = relicState.data[id];
    if (data && data.bonuses) {
      Object.entries(data.bonuses).forEach(([k, v]) => {
        totals[k] = (totals[k] || 0) + v;
      });
    }
  });
  return totals;
}
