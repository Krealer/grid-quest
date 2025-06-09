export const quests = {};

let questData = {};
let dataLoaded = false;

export async function loadQuestData() {
  if (dataLoaded) return questData;
  try {
    const res = await fetch('data/quests.json');
    if (res.ok) {
      questData = await res.json();
    }
  } catch {
    // ignore errors
  } finally {
    dataLoaded = true;
  }
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
}

export function completeQuest(id) {
  if (!quests[id]) {
    quests[id] = { started: true, completed: false };
  }
  quests[id].completed = true;
}

export function isQuestStarted(id) {
  return !!quests[id]?.started;
}

export function isQuestCompleted(id) {
  return !!quests[id]?.completed;
}

export function getActiveQuests() {
  return Object.keys(quests)
    .filter(id => quests[id].started && !quests[id].completed)
    .map(id => {
      const data = questData[id] || { title: id, description: '' };
      return { id, ...data };
    });
}
