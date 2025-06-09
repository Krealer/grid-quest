const STORAGE_KEY = 'gridquest.memory';

const memory = {
  npcs: new Set(),
  enemies: new Set(),
  items: new Set(),
  skills: new Set(),
  lore: new Set(),
  maps: new Set(),
  forkChoice: null,
};

function loadMemory() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.npcs)) memory.npcs = new Set(data.npcs);
    if (Array.isArray(data.enemies)) memory.enemies = new Set(data.enemies);
    if (Array.isArray(data.items)) memory.items = new Set(data.items);
    if (Array.isArray(data.skills)) memory.skills = new Set(data.skills);
    if (Array.isArray(data.lore)) memory.lore = new Set(data.lore);
    if (Array.isArray(data.maps)) memory.maps = new Set(data.maps);
    if (typeof data.forkChoice === 'string') memory.forkChoice = data.forkChoice;
  } catch {
    // ignore
  }
}

function saveMemory() {
  const data = {
    npcs: Array.from(memory.npcs),
    enemies: Array.from(memory.enemies),
    items: Array.from(memory.items),
    skills: Array.from(memory.skills),
    lore: Array.from(memory.lore),
    maps: Array.from(memory.maps),
    forkChoice: memory.forkChoice,
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

export function discoverSkill(id) {
  discover('skills', id);
}

export function discoverLore(id) {
  discover('lore', id);
}

export function discoverMap(id) {
  discover('maps', id);
}

export function setForkChoice(path) {
  memory.forkChoice = path;
  saveMemory();
}

export function getForkChoice() {
  return memory.forkChoice;
}
