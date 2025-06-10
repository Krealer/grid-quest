// Centralized interaction logic
import { getCurrentGrid } from './mapLoader.js';
import { isAdjacent } from './logic.js';
import { isChestOpened, openChest } from './chest.js';
import { hasItem, removeItem } from './inventory.js';
import { updateInventoryUI } from './inventory_state.js';
import { getEnemyData } from './enemy.js';
import { startCombat } from './combatSystem.js';
import { showDialogue } from './dialogueSystem.js';
import { getAllSkills, unlockSkill } from './skills.js';
import { echoAbsoluteIntro } from './dialogue_state.js';
import * as router from './router.js';
import { gameState } from './game_state.js';
import { triggerRotation } from './rotation_puzzle.js';

/**
 * Handles double click interactions on tiles.
 *
 * @param {MouseEvent} e The originating event
 * @param {{x:number,y:number,hp:number,maxHp:number}} player Player state
 * @param {HTMLElement} container Grid DOM element
 * @param {number} cols Number of columns in the current grid
 * @param {Record<string, any>} npcModules Map of npc id to module with interact()
 * @returns {Promise<number|void>} Updated column count if a door was triggered
 */
export async function handleTileInteraction(
  e,
  player,
  container,
  cols,
  npcModules = {}
) {
  if (gameState.isDead) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  if (!grid || !grid[y] || !grid[y][x]) return;
  if (!isAdjacent(player.x, player.y, x, y)) return;

  const tile = grid[y][x];
  switch (tile.type) {
    case 'D': {
      const required = tile.key || tile.requiresItem;
      if (required && !hasItem(required)) {
        showDialogue('The door is locked.');
        break;
      }
      const targetMap = tile.target;
      if (required === 'commander_badge') {
        return new Promise((resolve) => {
          showDialogue('Your commander badge unlocks the way.', async () => {
            if (tile.consumeItem) {
              removeItem(required);
              updateInventoryUI();
            }
            const { cols: newCols } = await router.loadMap(
              targetMap,
              tile.spawn
            );
            resolve(newCols);
          });
        });
      }
      if (required && tile.consumeItem) {
        removeItem(required);
        updateInventoryUI();
      }
      {
        const { cols: newCols } = await router.loadMap(targetMap, tile.spawn);
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
          if (result.item) {
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
          const index = y * cols + x;
          const tileEl = container.children[index];
          if (tileEl) {
            tileEl.classList.remove('chest');
            tileEl.classList.add('chest-opened');
          }
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
