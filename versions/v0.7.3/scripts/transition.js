import * as router from './router.js';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function transitionToMap(target, spawn) {
  const overlay = document.createElement('div');
  overlay.id = 'map-overlay';
  overlay.classList.add('map-transition');
  document.body.appendChild(overlay);
  // force reflow
  overlay.offsetWidth;
  overlay.classList.add('active');
  await delay(500);
  const { cols } = await router.loadMap(target.replace(/\.json$/, ''), spawn);
  overlay.classList.remove('active');
  await delay(500);
  overlay.remove();
  return { cols };
}
