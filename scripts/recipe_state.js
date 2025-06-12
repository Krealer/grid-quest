export const recipeState = {
  unlocked: new Set()
};

const recipeFlags = {
  // map memory flags to recipes for automatic unlocking
};

export function unlockRecipe(id) {
  recipeState.unlocked.add(id);
  document.dispatchEvent(new CustomEvent('recipeUnlocked', { detail: id }));
}

export function handleMemoryFlag(flag) {
  const id = recipeFlags[flag];
  if (id) unlockRecipe(id);
}

export function syncRecipesWithMemory(memorySet) {
  const set = memorySet || new Set();
  Object.keys(recipeFlags).forEach((flag) => {
    if (set.has(flag)) unlockRecipe(recipeFlags[flag]);
  });
}

export function isRecipeUnlocked(id) {
  return recipeState.unlocked.has(id);
}

// listen for memory flags being set to unlock associated recipes
document.addEventListener('memoryFlagSet', (e) => {
  handleMemoryFlag(e.detail);
});
