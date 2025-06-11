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

export async function updateCraftUI() {
  const list = document.getElementById('craft-list');
  if (!list) return;
  await loadRecipes();
  await loadBlueprints();
  list.innerHTML = '';
  const ids = [
    ...Object.keys(await loadRecipes()).filter((id) => isRecipeUnlocked(id)),
    ...Object.keys(await loadBlueprints()).filter((id) =>
      isBlueprintUnlocked(id)
    )
  ];
  ids.forEach((id) => {
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
    const reqs = Object.entries(data.ingredients)
      .map(([itm, qty]) => {
        const base = getItemData(itm) || { name: itm };
        const have = getItemCount(itm);
        const cls = have >= qty ? 'have' : 'missing';
        return `<span class="req ${cls}">${base.name} x${qty}</span>`;
      })
      .join(', ');
    row.innerHTML = `<strong>${data.name}</strong><div class="desc">${reqs}</div>`;
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
    overlay.scrollTop = 0;
    overlay.classList.add('active');
  }
}

document.addEventListener('inventoryUpdated', updateCraftUI);
document.addEventListener('blueprintUnlocked', updateCraftUI);
document.addEventListener('blueprintsLoaded', updateCraftUI);
