import { loadItems, getItemData } from './item_loader.js';
import { addItem, removeItem, getItemCount } from './inventory.js';
import { craftState } from './craft_state.js';

let recipes = {};
let loaded = false;

export async function loadRecipes() {
  if (loaded) return recipes;
  try {
    const res = await fetch('data/recipes.json');
    if (res.ok) {
      recipes = await res.json();
    }
  } catch {
    // ignore
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
