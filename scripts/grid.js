import { getForkChoice } from './player_memory.js';
import { player } from './player.js';

export function renderGrid(grid, container, environment = 'clear', fog = false) {
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

      switch (type) {
        case 'G':
          div.classList.add('ground');
          break;
        case 'C':
          div.classList.add('chest', 'blocked');
          break;
        case 'E':
          div.classList.add('enemy', 'blocked');
          break;
        case 'N':
          div.classList.add('npc', 'blocked');
          if (cell.npc) div.dataset.npc = cell.npc;
          break;
        case 'D':
          div.classList.add('door', 'blocked');
          break;
        case 't':
          div.classList.add('trap-light');
          break;
        case 'T':
          div.classList.add('trap-dark');
          break;
        case 'W':
          div.classList.add('water');
          break;
        case 'F':
          div.classList.add('fractured');
          break;
        case 'B':
          div.classList.add('bridge');
          break;
        default:
          div.classList.add('ground');
      }

      if (cell.flow) div.classList.add('flowing');
      if (cell.glow) div.classList.add('glowing');
      if (typeof cell.opacity === 'number') div.style.opacity = cell.opacity;

      if (fog) div.classList.add('fog-hidden');

      container.appendChild(div);
    });
  });
}
