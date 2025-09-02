import { setBossDefeated, setEnding } from './memory_flags.js';

const STORAGE_KEY = 'gridquest.ending';

const state = {
  path: null,
  summary: ''
};

function load() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const data = JSON.parse(json);
    state.path = data.path || null;
    state.summary = data.summary || '';
  } catch {}
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function recordEnding(path, summary) {
  state.path = path;
  state.summary = summary;
  save();
  setEnding(path);
  if (path === 'victory') setBossDefeated();
}

export function getEnding() {
  return { ...state };
}

load();
