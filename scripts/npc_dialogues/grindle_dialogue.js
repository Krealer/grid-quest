import { loadRecipes, canCraft, craft, getRecipe, beginCraftingSession } from '../craft.js';
import { craftState } from '../craft_state.js';
import { isRecipeUnlocked } from '../recipe_state.js';
import { showDialogue } from '../dialogueSystem.js';

export async function createGrindleDialogue() {
  await loadRecipes();
  const recipeIds = Object.keys(await loadRecipes()).filter(id => isRecipeUnlocked(id));
  beginCraftingSession();
  const options = recipeIds.map(id => ({
    label: `Craft ${getRecipe(id).name}`,
    goto: null,
    condition: () => canCraft(id),
    onChoose: async () => {
      const ok = await craft(id);
      if (ok && craftState.lastCrafted) {
        showDialogue(`You crafted ${getRecipe(id).name}!`);
      }
    }
  }));
  options.push({ label: 'Maybe later.', goto: null });
  return [
    {
      text: 'Mixing potions is like mixing dreams. Want to try?',
      options,
    },
  ];
}
