import { gameState } from './game_state.js';
import { addItem, giveItem } from './inventory.js';
import { updateInventoryUI } from './inventory_state.js';
import { giveRelic, setMemory } from './dialogue_state.js';
import { getItemData, loadItems } from './item_loader.js';
import { increaseMaxHp } from './player.js';
import { unlockSkillsFromItem, unlockSkillsFromRelic } from './skills.js';

const chestContents = {
  'map01:10,5': {
    item: 'rusty_key',
    message: 'Inside you find a rusty key.'
  },
  'map01:17,9': {
    item: 'defense_potion_I',
    message: 'The chest holds a Defense Potion.'
  },
  'map01:3,17': {
    item: 'old_coin',
    message: 'You pick up an old coin.'
  },
  'map02:5,5': {
    item: 'health_amulet',
    message: 'You found a shimmering amulet.',
    memoryFlag: 'map02_health_amulet'
  },
  'map02:9,9': {
    item: 'map02_key',
    message: 'You found a key among the traps.',
    memoryFlag: 'map02_key_found'
  },
  'map02:15,15': {
    item: 'empty_note',
    message: 'This chest was empty.',
    memoryFlag: 'empty_chest_seen'
  },
  'map03:10,12': {
    item: 'health_amulet',
    message: 'You feel stronger.'
  },
  'map05:10,9': {
    item: 'mysterious_key',
    message: 'The chest clicks open revealing a strange key.'
  },
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
  },
  'map12:9,9': {
    relic: 'compass_core',
    message: 'You obtained the Compass Core!'
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
  if (config.memoryFlag) {
    setMemory(config.memoryFlag);
  }
  let item = null;
  let items = null;
  let unlockedSkills = [];
  if (Array.isArray(config.items)) {
    items = [];
    for (const itm of config.items) {
      const data = getItemData(itm);
      if (data) {
        giveItem(itm, 1);
        items.push(data);
        unlockedSkills.push(...unlockSkillsFromItem(itm));
        if (player && itm === 'health_potion') {
          increaseMaxHp(1);
          gameState.maxHpBonus = (gameState.maxHpBonus || 0) + 1;
        }
      }
    }
    updateInventoryUI();
  } else if (config.item) {
    item = getItemData(config.item);
    if (item) {
      const qty = config.quantity || 1;
      giveItem(config.item, qty);
      if (player && config.item === 'health_potion') {
        increaseMaxHp(1);
        gameState.maxHpBonus = (gameState.maxHpBonus || 0) + 1;
      }
      updateInventoryUI();
      unlockedSkills = unlockSkillsFromItem(config.item);
    }
  }
  if (config.relic) {
    giveRelic(config.relic);
    unlockedSkills.push(...unlockSkillsFromRelic(config.relic));
  }
  return { item, items, message: config.message || null, unlockedSkills };
}
