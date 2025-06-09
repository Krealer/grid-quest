import { loadRecipes, loadBlueprints, getRecipe, getBlueprint, canCraft, craft } from './craft.js';
import { isRecipeUnlocked } from './recipe_state.js';
import { isBlueprintUnlocked } from './craft_state.js';

export async function updateCraftUI() {
  const list = document.getElementById('craft-list');
  if (!list) return;
  await loadRecipes();
  await loadBlueprints();
  list.innerHTML = '';
  const ids = [
    ...Object.keys(await loadRecipes()).filter(id => isRecipeUnlocked(id)),
    ...Object.keys(await loadBlueprints()).filter(id => isBlueprintUnlocked(id))
  ];
  ids.forEach(id => {
    const data = getRecipe(id) || getBlueprint(id);
    if (!data) return;
    const row = document.createElement('div');
    row.classList.add('craft-item');
    const btn = document.createElement('button');
    btn.textContent = 'Craft';
    btn.disabled = !canCraft(id);
    btn.addEventListener('click', async () => {
      const ok = await craft(id);
      if (ok) updateCraftUI();
    });
    row.innerHTML = `<strong>${data.name}</strong>`;
    row.appendChild(btn);
    list.appendChild(row);
  });
  if (ids.length === 0) {
    list.innerHTML = '<em>No known recipes</em>';
  }
}

export function toggleCraftView() {
  const overlay = document.getElementById('craft-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    updateCraftUI();
    overlay.classList.add('active');
  }
}

document.addEventListener('inventoryUpdated', updateCraftUI);
document.addEventListener('blueprintUnlocked', updateCraftUI);
