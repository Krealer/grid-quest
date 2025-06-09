import { loadItems, getItemData } from './item_loader.js';
import { addItem, removeItem, getItemCount } from './inventory.js';
import { craftState } from './craft_state.js';
import { isRecipeUnlocked } from './recipe_state.js';
import { showError } from './errorMessage.js';

let craftingAllowed = false;

export function beginCraftingSession() {
  craftingAllowed = true;
}

export function endCraftingSession() {
  craftingAllowed = false;
}

let recipes = {};
let loaded = false;

export async function loadRecipes() {
  if (loaded) return recipes;
  try {
    const res = await fetch('data/recipes.json');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    recipes = await res.json();
  } catch (err) {
    console.error('Failed to load recipes', err);
    showError('Failed to load recipes. Please try again later.');
  } finally {
    loaded = true;
  }
  return recipes;
}

export function getRecipe(id) {
  return recipes[id];
}

export function canCraft(id) {
  const recipe = recipes[id];
  if (!recipe) return false;
  return Object.entries(recipe.ingredients).every(([item, qty]) => getItemCount(item) >= qty);
}

export async function craft(id) {
  await loadRecipes();
  await loadItems();
  if (!craftingAllowed) return false;
  if (!isRecipeUnlocked(id)) return false;
  if (!canCraft(id)) return false;
  const recipe = recipes[id];
  for (const [item, qty] of Object.entries(recipe.ingredients)) {
    removeItem(item, qty);
  }
  const data = getItemData(recipe.result);
  if (data) {
    addItem({ ...data, id: recipe.result, quantity: recipe.quantity || 1 });
    craftState.lastCrafted = recipe.result;
    return true;
  }
  return false;
}
