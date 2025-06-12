const STORAGE_KEY = 'gridquest.blueprints';
const FUSION_KEY = 'gridquest.fusion';

export const craftState = {
  lastCrafted: null,
  unlockedBlueprints: new Set(),
  fusionUnlocked: false
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

function readFusionState() {
  return localStorage.getItem(FUSION_KEY) === 'true';
}

function saveFusionState(val) {
  localStorage.setItem(FUSION_KEY, val ? 'true' : 'false');
}

function saveUnlockedBlueprints(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

craftState.unlockedBlueprints = new Set(loadUnlockedBlueprints());
if (!craftState.unlockedBlueprints.size) {
  craftState.unlockedBlueprints.add('healing_salve_blueprint');
}
document.dispatchEvent(new CustomEvent('blueprintsLoaded'));
craftState.fusionUnlocked = readFusionState();

export function unlockBlueprint(id) {
  if (!craftState.unlockedBlueprints.has(id)) {
    craftState.unlockedBlueprints.add(id);
    saveUnlockedBlueprints(Array.from(craftState.unlockedBlueprints));
    document.dispatchEvent(
      new CustomEvent('blueprintUnlocked', { detail: id })
    );
  }
}

export function isBlueprintUnlocked(id) {
  return craftState.unlockedBlueprints.has(id);
}

export function getUnlockedBlueprints() {
  return Array.from(craftState.unlockedBlueprints);
}

export function unlockFusion() {
  if (!craftState.fusionUnlocked) {
    craftState.fusionUnlocked = true;
    saveFusionState(true);
    document.dispatchEvent(new CustomEvent('fusionUnlocked'));
  }
}

export function isFusionUnlocked() {
  return craftState.fusionUnlocked;
}

export function loadBlueprintState() {
  craftState.unlockedBlueprints = new Set(loadUnlockedBlueprints());
  document.dispatchEvent(new CustomEvent('blueprintsLoaded'));
}

export function loadFusionState() {
  craftState.fusionUnlocked = readFusionState();
}
