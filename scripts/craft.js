import { loadItems, getItemData } from './item_loader.js';
import { addItem, removeItem, getItemCount } from './inventory.js';
import { craftState } from './craft_state.js';
import { isRecipeUnlocked } from './recipe_state.js';
import { loadJson } from './dataService.js';

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
  const data = await loadJson('data/recipes.json');
  if (data) {
    recipes = data;
  }
  loaded = true;
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
