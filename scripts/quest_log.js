import { loadQuestData, getActiveQuests } from './quest_state.js';

export async function updateQuestUI() {
  const list = document.getElementById('quest-log');
  if (!list) return;
  await loadQuestData();
  const quests = getActiveQuests();
  list.innerHTML = '';
  quests.forEach(q => {
    const row = document.createElement('div');
    row.classList.add('quest-item');
    row.innerHTML = `<strong>${q.title}</strong><div class="desc">${q.description}</div>`;
    list.appendChild(row);
  });
  if (quests.length === 0) {
    list.innerHTML = '<em>No active quests</em>';
  }
}

export function toggleQuestLog() {
  const overlay = document.getElementById('quest-log-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    updateQuestUI();
    overlay.classList.add('active');
  }
}
