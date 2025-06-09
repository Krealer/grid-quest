import { hasMemory } from './dialogue_state.js';
import { loadJson } from './dataService.js';
import { showError } from './errorPrompt.js';

export const quests = {};

let questData = {};
let dataLoaded = false;

export async function loadQuestData() {
  if (dataLoaded) return questData;
  const data = await loadJson('data/quests.json');
  if (data) {
    questData = data;
  } else {
    showError('Failed to load quests');
  }
  dataLoaded = true;
  return questData;
}

export function getQuestData(id) {
  return questData[id];
}

export function startQuest(id) {
  if (!quests[id]) {
    quests[id] = { started: false, completed: false };
  }
  quests[id].started = true;
  document.dispatchEvent(new CustomEvent('questUpdated'));
}

export function completeQuest(id) {
  if (!quests[id]) {
    quests[id] = { started: true, completed: false };
  }
  quests[id].completed = true;
  loadQuestData().then(() => {
    const data = questData[id];
    if (data && Array.isArray(data.onCompleteUnlocks)) {
      data.onCompleteUnlocks.forEach(qId => startQuest(qId));
    }
    document.dispatchEvent(new CustomEvent('questUpdated'));
  });
}

export function isQuestStarted(id) {
  return !!quests[id]?.started;
}

export function isQuestCompleted(id) {
  return !!quests[id]?.completed;
}

export function getActiveQuests() {
  if (isQuestStarted('scout_tracking') && !isQuestCompleted('scout_tracking')) {
    if (hasMemory('scout_defeated')) {
      completeQuest('scout_tracking');
    }
  }
  return Object.keys(quests)
    .filter(id => quests[id].started && !quests[id].completed)
    .map(id => {
      const data = questData[id] || { title: id, description: '' };
      return { id, ...data };
    });
}
