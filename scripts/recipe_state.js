export const recipeState = {
  unlocked: new Set(['healing_salve'])
};

export function unlockRecipe(id) {
  recipeState.unlocked.add(id);
  document.dispatchEvent(new CustomEvent('recipeUnlocked', { detail: id }));
}

export function isRecipeUnlocked(id) {
  return recipeState.unlocked.has(id);
}
