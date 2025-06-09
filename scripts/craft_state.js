const STORAGE_KEY = 'gridquest.blueprints';

export const craftState = {
  lastCrafted: null,
  unlockedBlueprints: new Set(),
};

function loadUnlockedBlueprints() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function saveUnlockedBlueprints(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

craftState.unlockedBlueprints = new Set(loadUnlockedBlueprints());
document.dispatchEvent(new CustomEvent('blueprintsLoaded'));

export function unlockBlueprint(id) {
  if (!craftState.unlockedBlueprints.has(id)) {
    craftState.unlockedBlueprints.add(id);
    saveUnlockedBlueprints(Array.from(craftState.unlockedBlueprints));
    document.dispatchEvent(new CustomEvent('blueprintUnlocked', { detail: id }));
  }
}

export function isBlueprintUnlocked(id) {
  return craftState.unlockedBlueprints.has(id);
}

export function loadBlueprintState() {
  craftState.unlockedBlueprints = new Set(loadUnlockedBlueprints());
  document.dispatchEvent(new CustomEvent('blueprintsLoaded'));
}
