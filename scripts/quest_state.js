import { hasMemory, setMemory } from './dialogue_state.js';
import { loadJson } from './dataService.js';
import { showError } from './errorPrompt.js';

const state = {
  quests: {},
  data: {},
  loaded: false,
};

export function getQuests() {
  return state.quests;
}

export async function loadQuestData() {
  if (state.loaded) return state.data;
  const data = await loadJson('data/quests.json');
  if (data) {
    state.data = data;
  } else {
    showError('Failed to load quests');
  }
  state.loaded = true;
  return state.data;
}

export function getQuestData(id) {
  return state.data[id];
}

export function startQuest(id) {
  if (!state.quests[id]) {
    state.quests[id] = { started: false, completed: false };
  }
  state.quests[id].started = true;
  document.dispatchEvent(new CustomEvent('questUpdated'));
}

export function completeQuest(id) {
  if (!state.quests[id]) {
    state.quests[id] = { started: true, completed: false };
  }
  state.quests[id].completed = true;
  loadQuestData().then(() => {
    const data = state.data[id];
    if (data && Array.isArray(data.onCompleteUnlocks)) {
      data.onCompleteUnlocks.forEach(qId => startQuest(qId));
    }
    document.dispatchEvent(new CustomEvent('questUpdated'));
  });
}

export function isQuestStarted(id) {
  return !!state.quests[id]?.started;
}

export function isQuestCompleted(id) {
  return !!state.quests[id]?.completed;
}

export function getActiveQuests() {
  if (isQuestStarted('scout_tracking') && !isQuestCompleted('scout_tracking')) {
    if (hasMemory('scout_defeated')) {
      completeQuest('scout_tracking');
    }
  }
  if (isQuestStarted('crimson_request') && !isQuestCompleted('crimson_request')) {
    if (hasMemory('learned_leech')) {
      completeQuest('crimson_request');
    }
  }
  return Object.keys(state.quests)
    .filter(id => state.quests[id].started && !state.quests[id].completed)
    .map(id => {
      const data = state.data[id] || { title: id, description: '' };
      return { id, ...data };
    });
}

export const questState = state;

// track defeat of the goblin scout for quests
document.addEventListener('combatEnded', (e) => {
  if (e.detail.enemyHp <= 0 && e.detail.enemy.id === 'goblin_scout') {
    setMemory('scout_defeated');
  }
});
