import data from '../settings_data.js';

export const DEFAULT_SETTINGS = Object.fromEntries(
  Object.entries(data).map(([k, v]) => [k, v.default])
);

export function loadSettings() {
  const json = localStorage.getItem('gridquest.settings');
  if (!json) return { ...DEFAULT_SETTINGS };
  try {
    const obj = JSON.parse(json);
    return { ...DEFAULT_SETTINGS, ...obj };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem('gridquest.settings', JSON.stringify(settings));
}

export function applySettings(settings) {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  if (settings.colorblind) {
    grid.classList.add('colorblind');
  } else {
    grid.classList.remove('colorblind');
  }
  if (settings.tileLabels) {
    grid.classList.add('show-labels');
  } else {
    grid.classList.remove('show-labels');
  }
  if (settings.phoneCoordinates) {
    grid.classList.add('show-coords');
  } else {
    grid.classList.remove('show-coords');
  }

  const tiles = grid.querySelectorAll('.tile');
  tiles.forEach((t) => {
    const x = t.dataset.x;
    const y = t.dataset.y;
    if (settings.gridCoordinates) {
      t.title = `(${x},${y})`;
    } else {
      t.removeAttribute('title');
    }
    if (settings.phoneCoordinates) {
      t.dataset.coords = `(${x},${y})`;
    } else {
      delete t.dataset.coords;
    }
  });
}
