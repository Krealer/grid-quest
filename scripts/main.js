import { loadMap, renderMap } from './mapLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('game-grid');
  try {
    const grid = await loadMap('map01');
    renderMap(grid, container);
  } catch (err) {
    console.error(err);
  }
});
