import { gameState } from './game_state.js';
import { addItem, giveItem } from './inventory.js';
import { updateInventoryUI } from './inventory_ui.js';
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
  'map04:10,11': {
    item: 'mana_gem',
    message: 'You found a glowing Mana Gem.',
    memoryFlag: 'map04_chest_1_opened'
  },
  'map04:7,4': {
    item: 'ward_leaf',
    message: 'Inside lies a delicate Ward Leaf.',
    memoryFlag: 'map04_chest_2_opened'
  },
  'map04:18,10': {
    item: 'old_scroll',
    message: 'The chest holds an old scroll.',
    memoryFlag: 'map04_chest_3_opened'
  },
  'map05:10,9': {
    item: 'mysterious_key',
    message: 'The chest clicks open revealing a strange key.'
  },
  'map05:9,10': {
    item: 'defense_potion_II',
    message: 'Carefully prying it open yields a potent Defense Potion.'
  },
  'map05:2,1': {
    item: 'crystal_shard',
    message: 'Tucked in the corner lies a faintly glowing crystal shard.'
  },
  'map05:10,15': {
    item: 'rift_fragment',
    message: 'Inside the obvious chest rests a curious rift fragment.'
  },
  'map06:2,1': {
    item: 'stamina_dust',
    message: 'A simple chest sits near the entrance.'
  },
  'map06:18,2': {
    item: 'skill_token',
    message: 'You fish out a shining token behind the water.'
  },
  'map06:15,5': {
    item: 'reflect_potion',
    message: 'Traps surround this chest. Inside is a Reflect Potion.'
  },
  'map06:3,13': {
    item: 'blood_resin',
    message: 'Tucked at a hallway turn is a vial of blood resin.'
  },
  'map06:18,10': {
    item: 'echo_splinter',
    message: 'A distant alcove holds a faintly humming splinter.'
  },
  'map06:10,6': {
    item: 'crystal_seed',
    message: 'In the middle north lies a crystal seed.'
  },
  'map06:1,15': {
    item: 'mana_scroll',
    message: 'Hidden in a maze corner is a rare mana scroll.'
  },
  'map06:3,17': {
    item: 'forgotten_ring',
    message: 'This false dead end conceals a forgotten ring.'
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
