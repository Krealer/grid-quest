import { getCurrentGrid } from './mapLoader.js';
import { onStepEffect, isWalkable } from './tile_type.js';
import { findPath } from './pathfinder.js';
import { stepTo } from './player.js';
import * as router from './router.js';
import { updateHpDisplay } from './ui/playerDisplay.js';
import { isMovementDisabled } from './movement.js';

let isMoving = false;

export function isPlayerMoving() {
  return isMoving;
}

export function handleTileClick(
  e,
  player,
  container,
  cols,
  settings,
  isInBattle
) {
  if (isMoving || isInBattle || isMovementDisabled()) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  const tileType = grid[y][x].type;

  if (!isWalkable(tileType)) return;

  const path = findPath(grid, player.x, player.y, x, y);
  if (path.length === 0) return;

  let index = 0;
  isMoving = true;
  async function step() {
    if (index >= path.length) {
      isMoving = false;
      return;
    }
    const pos = path[index];
    stepTo(pos.x, pos.y);
    router.drawPlayer(player, container, cols);
    const tile = grid[player.y][player.x];
    await onStepEffect(tile.type, player, player.x, player.y);
    updateHpDisplay();
    index++;
    const delayMap = { slow: 300, normal: 150, fast: 75 };
    const delay = delayMap[settings.movementSpeed] || 150;
    setTimeout(() => requestAnimationFrame(step), delay);
  }
  requestAnimationFrame(step);
}
