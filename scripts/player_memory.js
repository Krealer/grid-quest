const STORAGE_KEY = 'gridquest.memory';

const memory = {
  npcs: new Set(),
  enemies: new Set(),
  items: new Set(),
};

function loadMemory() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.npcs)) memory.npcs = new Set(data.npcs);
    if (Array.isArray(data.enemies)) memory.enemies = new Set(data.enemies);
    if (Array.isArray(data.items)) memory.items = new Set(data.items);
  } catch {
    // ignore
  }
}

function saveMemory() {
  const data = {
    npcs: Array.from(memory.npcs),
    enemies: Array.from(memory.enemies),
    items: Array.from(memory.items),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

loadMemory();

export function discover(type, id) {
  if (!id || !memory[type]) return;
  if (!memory[type].has(id)) {
    memory[type].add(id);
    saveMemory();
    document.dispatchEvent(
      new CustomEvent('memoryUpdated', { detail: { type, id } })
    );
  }
}

export function hasDiscovered(type, id) {
  return !!memory[type] && memory[type].has(id);
}

export function getDiscovered(type) {
  return memory[type] ? Array.from(memory[type]) : [];
}
