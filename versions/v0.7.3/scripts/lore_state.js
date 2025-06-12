const STORAGE_KEY = 'gridquest.lore_flags';

const flags = new Set();

function load() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) {
      arr.forEach((f) => flags.add(f));
    }
  } catch {
    // ignore malformed data
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(flags)));
}

load();

export function setLoreFlag(flag) {
  if (!flag) return;
  if (!flags.has(flag)) {
    flags.add(flag);
    save();
  }
}

export function hasLoreFlag(flag) {
  return flags.has(flag);
}

export function getLoreFlags() {
  return Array.from(flags);
}

export function isEchoVergeTriggered() {
  return flags.has('echo_verge_triggered');
}

export function isEchoFragBreach() {
  return flags.has('echo_frag_breach');
}
