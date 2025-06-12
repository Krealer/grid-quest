/** @jest-environment jsdom */
import { jest } from '@jest/globals';

const recipeData = {
  healing_salve: {
    id: 'healing_salve',
    name: 'Healing Salve',
    blueprintId: 'healing_salve_blueprint',
    ingredients: {}
  },
  defense_potion_I: {
    id: 'defense_potion_I',
    name: 'Defense Potion I',
    blueprintId: 'defense_potion_I_blueprint',
    ingredients: {}
  }
};

let getKnownRecipes, unlockedRecipes, unlockedBlueprints;

beforeEach(async () => {
  jest.resetModules();
  unlockedRecipes = new Set(['healing_salve']);
  unlockedBlueprints = new Set(['healing_salve_blueprint']);

  jest.unstable_mockModule('../scripts/craft.js', () => ({
    loadRecipes: jest.fn(async () => recipeData),
    loadBlueprints: jest.fn(async () => ({})),
    getRecipe: jest.fn((id) => recipeData[id]),
    getBlueprint: jest.fn(() => null),
    canCraft: jest.fn(() => true),
    craft: jest.fn()
  }));

  jest.unstable_mockModule('../scripts/item_loader.js', () => ({
    getItemData: jest.fn(() => ({}))
  }));

  jest.unstable_mockModule('../scripts/inventory.js', () => ({
    getItemCount: jest.fn(() => 0)
  }));

  jest.unstable_mockModule('../scripts/recipe_state.js', () => ({
    isRecipeUnlocked: jest.fn((id) => unlockedRecipes.has(id))
  }));

  jest.unstable_mockModule('../scripts/craft_state.js', () => ({
    isBlueprintUnlocked: jest.fn((id) => unlockedBlueprints.has(id))
  }));

  ({ getKnownRecipes } = await import('../scripts/craft_ui.js'));
});

test('filters recipes based on unlocked lists', async () => {
  let ids = await getKnownRecipes();
  expect(ids).toEqual(['healing_salve']);

  unlockedRecipes.add('defense_potion_I');
  unlockedBlueprints.add('defense_potion_I_blueprint');
  ids = await getKnownRecipes();
  expect(ids).toEqual(expect.arrayContaining(['healing_salve', 'defense_potion_I']));

  unlockedBlueprints.delete('defense_potion_I_blueprint');
  ids = await getKnownRecipes();
  expect(ids).not.toContain('defense_potion_I');
});
