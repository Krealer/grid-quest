import {
  loadRecipes,
  loadBlueprints,
  getRecipe,
  getBlueprint,
  canCraft,
  craft
} from './craft.js';
import { isRecipeUnlocked } from './recipe_state.js';
import { isBlueprintUnlocked } from './craft_state.js';
import { getItemData } from './item_loader.js';
import { getItemCount } from './inventory.js';

export async function getKnownRecipes() {
  await loadRecipes();
  await loadBlueprints();
  const recipeData = await loadRecipes();
  return Object.keys(recipeData).filter((id) => {
    const rec = recipeData[id];
    const blueprintOk =
      !rec.blueprintId || isBlueprintUnlocked(rec.blueprintId);
    return isRecipeUnlocked(id) && blueprintOk;
  });
}

export async function updateCraftUI() {
  const list = document.getElementById('craft-list');
  if (!list) return;
  list.innerHTML = '';
  const ids = await getKnownRecipes();
  ids.forEach((id) => {
    const data = getRecipe(id) || getBlueprint(id);
    if (!data) return;
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.dataset.recipeId = id;
    const reqs = Object.entries(data.ingredients)
      .map(([itm, qty]) => {
        const base = getItemData(itm) || { name: itm };
        const have = getItemCount(itm);
        const cls = have >= qty ? 'have' : 'missing';
        return `<span class="req ${cls}">${base.name} x${qty}</span>`;
      })
      .join(' + ');
    const resultName = getItemData(data.result)?.name || data.result;
    card.innerHTML = `
      <strong>${data.name}</strong>
      <div class="ingredients">${reqs}</div>
      <div class="result">&rarr; ${resultName}</div>`;
    const btn = document.createElement('button');
    btn.textContent = 'Craft';
    btn.dataset.recipeId = id;
    btn.disabled = !canCraft(id);
    btn.addEventListener('click', async (e) => {
      const rid = e.currentTarget.dataset.recipeId;
      const ok = await craft(rid);
      if (ok) updateCraftUI();
    });
    card.appendChild(btn);
    list.appendChild(card);
  });
  if (ids.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = "You don't know any crafting recipes yet.";
    list.appendChild(msg);
  }
}

export function toggleCraftView() {
  const overlay = document.getElementById('craft-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    updateCraftUI();
    overlay.scrollTop = 0;
    overlay.classList.add('active');
  }
}

document.addEventListener('inventoryUpdated', updateCraftUI);
document.addEventListener('blueprintUnlocked', updateCraftUI);
document.addEventListener('blueprintsLoaded', updateCraftUI);
document.addEventListener('recipeUnlocked', updateCraftUI);

window.addEventListener('resize', () => {
  const overlay = document.getElementById('craft-overlay');
  if (overlay && overlay.classList.contains('active')) {
    updateCraftUI();
  }
});
