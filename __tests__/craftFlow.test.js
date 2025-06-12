/** @jest-environment jsdom */
import { jest } from '@jest/globals';

const recipeData = {
  defense_potion_I: {
    id: 'defense_potion_I',
    name: 'Defense Potion I',
    blueprintId: 'defense_potion_I_blueprint',
    ingredients: { bone_fragment: 1, goblin_gear: 1 },
    result: 'defense_potion_I',
    quantity: 1
  }
};

let inventory;

beforeEach(async () => {
  jest.resetModules();
  inventory = { bone_fragment: 1, goblin_gear: 1 };

  jest.unstable_mockModule('../scripts/craft.js', () => ({
    loadRecipes: jest.fn(async () => recipeData),
    loadBlueprints: jest.fn(async () => ({})),
    getRecipe: jest.fn((id) => recipeData[id]),
    getBlueprint: jest.fn(() => null),
    canCraft: jest.fn(() => true),
    craft: jest.fn(async (id) => {
      Object.entries(recipeData[id].ingredients).forEach(([k, q]) => {
        inventory[k] -= q;
      });
      const out = recipeData[id].result;
      inventory[out] = (inventory[out] || 0) + (recipeData[id].quantity || 1);
      return true;
    })
  }));

  jest.unstable_mockModule('../scripts/recipe_state.js', () => ({
    isRecipeUnlocked: jest.fn(() => true)
  }));

  jest.unstable_mockModule('../scripts/craft_state.js', () => ({
    isBlueprintUnlocked: jest.fn(() => true)
  }));

  jest.unstable_mockModule('../scripts/item_loader.js', () => ({
    getItemData: jest.fn((id) => ({ name: id }))
  }));

  jest.unstable_mockModule('../scripts/inventory.js', () => ({
    getItemCount: jest.fn((id) => inventory[id] || 0)
  }));
});

test('recipe card renders and crafting updates inventory', async () => {
  const { updateCraftUI } = await import('../scripts/craft_ui.js');
  document.body.innerHTML = '<div id="craft-list"></div>';
  await updateCraftUI();

  const card = document.querySelector('.recipe-card');
  expect(card).not.toBeNull();
  const button = card.querySelector('button');
  expect(button).not.toBeNull();

  await button.click();
  expect(inventory.bone_fragment).toBe(0);
  expect(inventory.goblin_gear).toBe(0);
  expect(inventory.defense_potion_I).toBe(1);
});
