// Centralized interaction logic
import { getCurrentGrid } from './mapLoader.js';
import { isAdjacent } from './logic.js';
import { isChestOpened, openChest } from './chest.js';
import { hasItem } from './inventory.js';
import { getEnemyData } from './enemy.js';
import { startCombat } from './combatSystem.js';
import { showDialogue } from './dialogueSystem.js';
import { getAllSkills, unlockSkill } from './skills.js';
import * as router from './router.js';

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
      if (tile.key && !hasItem(tile.key)) {
        showDialogue('The door is locked.');
        break;
      }
      const { cols: newCols } = await router.loadMap(tile.target, tile.spawn);
      return newCols;
    }
    case 'E': {
      const index = y * cols + x;
      const tileEl = container.children[index];
      if (tileEl) {
        tileEl.classList.remove('enemy', 'blocked');
        tileEl.classList.add('ground');
      }
      tile.type = 'G';
      const enemy = getEnemyData('E') || { name: 'Enemy', hp: 50 };
      const intro = enemy.intro || 'A foe appears!';
      showDialogue(intro, () => startCombat({ id: 'E', ...enemy }, player));
      break;
    }
    case 'C': {
      const chestId = `${router.getCurrentMapName()}:${x},${y}`;
      if (!isChestOpened(chestId)) {
        const item = await openChest(chestId);
        if (item) {
          showDialogue(`You obtained ${item.name}!`);
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
    default:
      break;
  }
}
