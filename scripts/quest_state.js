export const quests = {};

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
