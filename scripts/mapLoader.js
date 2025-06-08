let currentGrid = null;
let currentEnvironment = 'clear';

export async function loadMap(name) {
  const response = await fetch(`data/maps/${name}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load map ${name}`);
  }
  const data = await response.json();
  currentEnvironment = data.environment || 'clear';
  currentGrid = data.grid.map(row => {
    if (typeof row === 'string') {
      return row.split('').map(ch => ({ type: ch }));
    }
    return row.map(cell => {
      if (typeof cell === 'string') {
        return { type: cell };
      }
      return cell;
    });
  });
  return { grid: currentGrid, environment: currentEnvironment };
}

export function getCurrentGrid() {
  return currentGrid;
}

export function getCurrentEnvironment() {
  return currentEnvironment;
}

export function renderMap(grid, container, environment = currentEnvironment) {
  container.innerHTML = '';
  const cols = grid[0].length;
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${cols}, 32px)`;

  Array.from(container.classList)
    .filter(c => c.startsWith('env-'))
    .forEach(c => container.classList.remove(c));
  if (environment) {
    container.classList.add(`env-${environment}`);
  }

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement('div');
      div.classList.add('tile');
      div.dataset.x = x;
      div.dataset.y = y;

      switch (cell.type) {
        case 'G':
          div.classList.add('ground');
          break;
        case 'C':
          div.classList.add('chest', 'blocked');
          break;
        case 'E':
          div.classList.add('enemy', 'blocked');
          break;
        case 'D':
          div.classList.add('door', 'blocked');
          break;
        default:
          div.classList.add('ground');
      }

      container.appendChild(div);
    });
  });
}
