import { keyItems } from './items/key.js';
import { combatItems } from './items/combat.js';
import { generalItems } from './items/general.js';
import { loreItems } from './items/lore.js';
import { equipableItems } from './items/equipable.js';
import { craftingItems } from './items/crafting.js';

export const itemData = {
  ...keyItems,
  ...combatItems,
  ...generalItems,
  ...loreItems,
  ...equipableItems,
  ...craftingItems,
};

export function getItemDataLocal(id) {
  return itemData[id];
}
