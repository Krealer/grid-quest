import { gameState } from './game_state.js';
import { addItem } from './inventory.js';
import { updateInventoryUI } from './inventory_state.js';
import { giveRelic } from './dialogue_state.js';
import { getItemData, loadItems } from './item_loader.js';
import { increaseMaxHp } from './player.js';
import { unlockSkillsFromItem, unlockSkillsFromRelic } from './skills.js';

const chestContents = {
  'map01:11,3': { item: 'rusty_key' },
  'map02:5,5': { item: 'silver_key', message: 'You found a silver key.' },
  'map02:8,12': { message: 'This chest was empty.' },
  'map02:15,15': { item: 'potion_of_health' },
  'map03:10,10': { item: 'health_amulet' },
  'map05:10,9': { item: 'mysterious_key', message: 'The chest clicks open revealing a strange key.' },
  'map_warrior:18,18': {
    relic: 'warrior_sigil',
    message: 'You obtained the Warrior Sigil!'
  },
  'map_guardian:18,18': {
    relic: 'guardian_emblem',
    message: 'You obtained the Guardian Emblem!'
  },
  'map_alchemist:18,18': {
    relic: 'alchemist_catalyst',
    message: 'You obtained the Alchemist Catalyst!'
  }
};

export function isChestOpened(id) {
  return gameState.openedChests.has(id);
}

export async function openChest(id, player) {
  if (isChestOpened(id)) return null;
  gameState.openedChests.add(id);
  await loadItems();
  const config = chestContents[id] || {};
  let item = null;
  let unlockedSkills = [];
  if (config.item) {
    item = getItemData(config.item);
    if (item) {
      const qty = config.quantity || 1;
      addItem({ ...item, id: config.item, quantity: qty });
      if (player) {
        if (config.item === 'potion_of_health') {
          increaseMaxHp(1);
          gameState.maxHpBonus = (gameState.maxHpBonus || 0) + 1;
        } else if (config.item === 'health_amulet') {
          if (!player.bonusHpGiven?.health_amulet) {
            increaseMaxHp(2);
            gameState.maxHpBonus = (gameState.maxHpBonus || 0) + 2;
            if (!player.bonusHpGiven) player.bonusHpGiven = {};
            player.bonusHpGiven.health_amulet = true;
          }
        }
      }
      updateInventoryUI();
      unlockedSkills = unlockSkillsFromItem(config.item);
    }
  }
  if (config.relic) {
    giveRelic(config.relic);
    unlockedSkills.push(...unlockSkillsFromRelic(config.relic));
  }
  return { item, message: config.message || null, unlockedSkills };
}
