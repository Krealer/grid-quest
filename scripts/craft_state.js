export const craftState = {
  lastCrafted: null,
  unlockedBlueprints: new Set(),
};

export function unlockBlueprint(id) {
  craftState.unlockedBlueprints.add(id);
  document.dispatchEvent(new CustomEvent('blueprintUnlocked', { detail: id }));
}

export function isBlueprintUnlocked(id) {
  return craftState.unlockedBlueprints.has(id);
}
