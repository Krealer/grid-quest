import { getForkChoice } from './player_memory.js';
import { player } from './player.js';
import { getTileDescription } from './tile_type.js';
import { getTileInfo } from './tile_definitions.js';

export function renderGrid(
  grid,
  container,
  environment = 'clear',
  fog = false
) {
  container.innerHTML = '';
  const cols = grid[0].length;
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${cols}, 32px)`;

  Array.from(container.classList)
    .filter((c) => c.startsWith('env-'))
    .forEach((c) => container.classList.remove(c));
  if (environment) {
    container.classList.add(`env-${environment}`);
  }

  grid.forEach((row, y) => {
    const choice = getForkChoice();
    const cls = player.classId;
    row.forEach((cell, x) => {
      const div = document.createElement('div');
      div.classList.add('tile');
      div.dataset.x = x;
      div.dataset.y = y;

      let type = cell.type;
      if (cell.memoryType && choice && cell.memoryType[choice]) {
        type = cell.memoryType[choice];
      }
      if (cell.classType && cls && cell.classType[cls]) {
        type = cell.classType[cls];
      }

      if (type === 'N' && (cell.style === 'advanced' || cell.advanced)) {
        type = 'n';
      }

      const info = getTileInfo(type);
      div.classList.add(`tile-${type}`);
      div.classList.add(`shape-${info.shape}`);
      if (!info.walkable) div.classList.add('blocked');
      if (type === 'N' || type === 'n') {
        if (cell.npc) div.dataset.npc = cell.npc;
      }

      div.dataset.label = getTileDescription(type);
      div.title = `(${x},${y})`;

      if (cell.locked) div.classList.add('locked');
      if (cell.flow) div.classList.add('flowing');
      if (cell.glow) div.classList.add('glowing');
      if (typeof cell.opacity === 'number') div.style.opacity = cell.opacity;

      if (fog) div.classList.add('fog-hidden');

      container.appendChild(div);
    });
  });
}
