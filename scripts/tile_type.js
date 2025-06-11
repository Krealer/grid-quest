// Base tile definitions. Ensures ground (G), walls (F) and water (W)
// remain explicitly defined for map navigation like The Silent Prism.
export const TILE_DEFS = {
  G: { walkable: true, interactable: false, description: 'Ground' },
  F: { walkable: false, interactable: false, description: 'Wall' },
  W: { walkable: false, interactable: true, description: 'Water' },
  t: { walkable: true, interactable: false, description: 'Light Trap' },
  T: { walkable: true, interactable: false, description: 'Heavy Trap' },
  C: { walkable: false, interactable: true, description: 'Chest' },
  D: { walkable: false, interactable: true, description: 'Door' },
  N: { walkable: false, interactable: true, description: 'NPC' },
  E: { walkable: false, interactable: true, description: 'Enemy' },
  echo: { walkable: true, interactable: true, description: 'Memory Echo' },
  B: { walkable: true, interactable: false, description: 'Bridge' }
};

export function isWalkable(symbol) {
  return TILE_DEFS[symbol]?.walkable ?? false;
}

export function isInteractable(symbol) {
  return TILE_DEFS[symbol]?.interactable ?? false;
}

import { showDialogue } from './dialogueSystem.js';
import { healFull, healToFull } from './player.js';
import { applyDamage } from './logic.js';
import { triggerDarkTrap, triggerFireTrap } from './trap_logic.js';
import { getCurrentGrid } from './mapLoader.js';

export async function onStepEffect(symbol, player, x, y) {
  const grid = getCurrentGrid();
  const container = document.getElementById('game-grid');
  const tileEl = container?.children[y * grid[0].length + x];
  if (symbol === 't') {
    triggerDarkTrap(player, applyDamage, showDialogue, x, y);
    if (tileEl) {
      tileEl.classList.add('triggered');
      setTimeout(() => tileEl.classList.remove('triggered'), 400);
    }
  } else if (symbol === 'T') {
    triggerFireTrap(player, applyDamage, showDialogue, x, y);
    if (tileEl) {
      tileEl.classList.add('triggered');
      setTimeout(() => tileEl.classList.remove('triggered'), 400);
    }
  } else if (symbol === 'W') {
    healFull();
    showDialogue('The cool water rejuvenates you. HP fully restored.');
    if (tileEl) {
      tileEl.classList.add('ripple');
      setTimeout(() => tileEl.classList.remove('ripple'), 800);
    }
  }
}

// Interaction effects for doors, chests, enemies, NPCs and echoes
import { isChestOpened, openChest } from './chest.js';
import { hasItem, removeItem, useKey } from './inventory.js';
import { updateInventoryUI } from './inventory_ui.js';
import { getEnemyData } from './enemy.js';
import { startCombat } from './combatSystem.js';
import { getAllSkills, unlockSkill } from './skills.js';
import { echoAbsoluteIntro, setMemory } from './dialogue_state.js';
import * as router from './router.js';
import { transitionToMap } from './transition.js';
import { enterDoor } from './player.js';
import { gameState } from './game_state.js';
import { triggerRotation } from './rotation_puzzle.js';
import { recordEchoConversation } from './player_memory.js';
import { getEchoData } from './echo_data.js';
import { setLoreFlag } from './lore_state.js';
import { markItemUsed } from '../info/items.js';

export async function onInteractEffect(
  tile,
  x,
  y,
  player,
  container,
  cols,
  npcModules = {}
) {
  switch (tile.type) {
    case 'D': {
      const required = tile.key || tile.requiresItem;
      const targetMap = tile.target;
      if (required && !hasItem(required) && tile.locked) {
        showDialogue("It\u2019s locked.");
        break;
      }
      if (required === 'commander_badge') {
        return new Promise((resolve) => {
          showDialogue('Your commander badge unlocks the way.', async () => {
            if (tile.consumeItem) {
              removeItem(required);
              markItemUsed(required);
              updateInventoryUI();
            }
            const { cols: newCols } = await transitionToMap(targetMap, tile.spawn);
            resolve(newCols);
          });
        });
      }
      if (tile.locked && required) {
        return new Promise((resolve) => {
          showDialogue('You use the key to unlock the door.', async () => {
            if (tile.consumeItem) {
              useKey(required);
              markItemUsed(required);
              updateInventoryUI();
            }
            tile.locked = false;
            const { cols: newCols } = await enterDoor(targetMap, tile.spawn);
            resolve(newCols);
          });
        });
      }
      if (required && tile.consumeItem) {
        useKey(required);
        markItemUsed(required);
        updateInventoryUI();
      }
      {
        const { cols: newCols } = await enterDoor(targetMap, tile.spawn);
        return newCols;
      }
    }
    case 'E': {
      const index = y * cols + x;
      const tileEl = container.children[index];
      if (tileEl) {
        tileEl.classList.remove('enemy', 'blocked');
        tileEl.classList.add('ground');
      }
      tile.type = 'G';
      gameState.lastEnemyPos = { x, y };
      const enemyId = tile.enemyId || 'goblin01';
      const enemy = getEnemyData(enemyId) || { name: 'Enemy', hp: 50 };
      if (enemyId === 'echo_absolute') {
        echoAbsoluteIntro();
        startCombat({ id: enemyId, ...enemy }, player);
      } else {
        const intro = enemy.intro || 'A foe appears!';
        showDialogue(intro, () => startCombat({ id: enemyId, ...enemy }, player));
      }
      break;
    }
    case 'C': {
      const chestId = `${router.getCurrentMapName()}:${x},${y}`;
      const required = tile.key || tile.requiresItem;
      if (required && !hasItem(required)) {
        showDialogue('The chest is locked.');
        break;
      }
      if (!isChestOpened(chestId)) {
        if (required && tile.consumeItem) {
          removeItem(required);
          updateInventoryUI();
        }
        const result = await openChest(chestId, player);
        if (result) {
          if (result.message) {
            showDialogue(result.message);
          }
          if (Array.isArray(result.items)) {
            result.items.forEach((it) => {
              if (it) showDialogue(`You obtained ${it.name}!`);
            });
          } else if (result.item) {
            showDialogue(`You obtained ${result.item.name}!`);
          }
          if (Array.isArray(result.unlockedSkills)) {
            result.unlockedSkills.forEach((id) => {
              const skill = getAllSkills()[id];
              if (skill) {
                showDialogue(`You've learned a new skill: ${skill.name}!`);
              }
            });
          }
          const idx = y * cols + x;
          const tileEl = container.children[idx];
          if (tileEl) {
            tileEl.classList.remove('chest');
            tileEl.classList.add('chest-opened');
          }
          tile.type = 'G';
          for (const [id, skill] of Object.entries(getAllSkills())) {
            if (skill.unlockCondition?.chest === chestId) {
              if (unlockSkill(id)) {
                showDialogue(`You've learned a new skill: ${skill.name}!`);
              }
            }
          }
        }
      }
      break;
    }
    case 'echo': {
      const echo = getEchoData(tile.id);
      if (echo) {
        for (const line of echo.text) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => showDialogue(line, resolve));
        }
        recordEchoConversation(tile.id);
        setLoreFlag(echo.flag);
        setMemory(echo.flag);
      }
      const index = y * cols + x;
      const tileEl = container.children[index];
      if (tileEl) {
        tileEl.classList.remove('echo', 'blocked');
        tileEl.classList.add('ground');
      }
      tile.type = 'G';
      break;
    }
    case 'W': {
      healToFull();
      showDialogue('The cool water rejuvenates you. HP fully restored.');
      const index = y * cols + x;
      const tileEl = container.children[index];
      if (tileEl) {
        tileEl.classList.add('ripple');
        setTimeout(() => tileEl.classList.remove('ripple'), 800);
      }
      break;
    }
    case 'N': {
      const npcId = tile.npc;
      const npc = npcModules[npcId];
      if (npc && typeof npc.interact === 'function') {
        npc.interact();
      }
      break;
    }
    case 'G': {
      if (tile.rotate) {
        triggerRotation(tile.rotate);
      }
      break;
    }
    default:
      break;
  }
}

export function getTileDescription(symbol) {
  return TILE_DEFS[symbol]?.description || 'Unknown';
}
