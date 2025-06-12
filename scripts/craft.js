import { loadItems, getItemData } from './item_loader.js';
import {
  addItem,
  removeItem,
  getItemCount,
  equipItem,
  getEquippedItem
} from './inventory.js';
import {
  craftState,
  isBlueprintUnlocked,
  isFusionUnlocked
} from './craft_state.js';
import { getItemBonuses } from './item_stats.js';
import { isRecipeUnlocked } from './recipe_state.js';
import { loadJson } from './dataService.js';
import { showError } from './errorPrompt.js';
import { notify } from '../ui/notification.js';

let craftingAllowed = false;

export function beginCraftingSession() {
  if (isFusionUnlocked()) {
    craftingAllowed = true;
  }
}

export function endCraftingSession() {
  craftingAllowed = false;
}

let recipes = {};
let loaded = false;
let blueprints = {};
let blueprintsLoaded = false;

export async function loadRecipes() {
  if (loaded) return recipes;
  const data = await loadJson('data/recipes.json');
  if (data) {
    recipes = data;
  } else {
    showError('Failed to load recipes');
  }
  loaded = true;
  return recipes;
}

export async function loadBlueprints() {
  if (blueprintsLoaded) return blueprints;
  const data = await loadJson('data/blueprints.json');
  if (data) {
    blueprints = data;
  } else {
    showError('Failed to load blueprints');
  }
  blueprintsLoaded = true;
  return blueprints;
}

export function getBlueprint(id) {
  return blueprints[id];
}

export function getRecipe(id) {
  return recipes[id];
}

export function canCraft(id) {
  const recipe = recipes[id];
  if (!recipe) return false;
  if (recipe.blueprintId && !isBlueprintUnlocked(recipe.blueprintId))
    return false;
  if (!isRecipeUnlocked(id)) return false;
  return Object.entries(recipe.ingredients).every(
    ([item, qty]) => getItemCount(item) >= qty
  );
}

export async function craft(id) {
  await loadRecipes();
  await loadBlueprints();
  await loadItems();
  if (!craftingAllowed) return false;
  const recipe = recipes[id];
  if (!recipe) return false;
  if (recipe.blueprintId && !isBlueprintUnlocked(recipe.blueprintId))
    return false;
  if (!isRecipeUnlocked(id)) return false;
  if (!canCraft(id)) {
    notify('Missing materials.');
    return false;
  }
  for (const [item, qty] of Object.entries(recipe.ingredients)) {
    removeItem(item, qty);
  }
  const data = getItemData(recipe.result);
  if (data) {
    addItem({ ...data, id: recipe.result, quantity: recipe.quantity || 1 });
    craftState.lastCrafted = recipe.result;
    const bonus = getItemBonuses(recipe.result);
    if (bonus && bonus.slot && !getEquippedItem(bonus.slot)) {
      equipItem(recipe.result);
    }
    if (bonus && bonus.slot) {
      document.dispatchEvent(
        new CustomEvent('equipmentCrafted', { detail: recipe.result })
      );
    }
    notify(`Crafted ${data.name}!`);
    return true;
  }
  return false;
}
