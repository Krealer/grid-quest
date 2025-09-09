let level = 1;
const classes = ['scale-small', 'scale-medium', 'scale-large'];
let grid;

function apply() {
  if (!grid) return;
  grid.classList.remove(...classes);
  grid.classList.add(classes[level]);
}

function change(delta) {
  level = Math.min(2, Math.max(0, level + delta));
  apply();
}

export function initZoom(container) {
  grid = container;
  apply();
  const zoomIn = document.getElementById('zoom-in');
  const zoomOut = document.getElementById('zoom-out');
  zoomIn?.addEventListener('click', () => change(1));
  zoomOut?.addEventListener('click', () => change(-1));
}

export function setZoomEnabled(enabled) {
  const controls = document.getElementById('zoom-controls');
  if (!controls) return;
  controls.style.display = enabled ? 'flex' : 'none';
  if (!enabled) {
    level = 1;
    apply();
  }
}
