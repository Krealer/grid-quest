/** @jest-environment jsdom */
import { jest } from '@jest/globals';

const recipeData = {
  health_amulet: {
    id: 'health_amulet',
    name: 'Health Amulet',
    blueprintId: 'health_amulet_blueprint',
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
  unlockedRecipes = new Set();
  unlockedBlueprints = new Set();

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
  expect(ids).toEqual([]);

  unlockedRecipes.add('defense_potion_I');
  unlockedBlueprints.add('defense_potion_I_blueprint');
  ids = await getKnownRecipes();
  expect(ids).toEqual(['defense_potion_I']);

  unlockedRecipes.add('health_amulet');
  unlockedBlueprints.add('health_amulet_blueprint');
  ids = await getKnownRecipes();
  expect(ids).toEqual(expect.arrayContaining(['defense_potion_I', 'health_amulet']));

  unlockedBlueprints.delete('defense_potion_I_blueprint');
  ids = await getKnownRecipes();
  expect(ids).not.toContain('defense_potion_I');
});
