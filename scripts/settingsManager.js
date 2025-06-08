const DEFAULT_SETTINGS = {
  sound: true,
  scale: 'medium',
  animations: true,
};

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
  const scales = ['scale-small', 'scale-medium', 'scale-large'];
  grid.classList.remove(...scales);
  grid.classList.add(`scale-${settings.scale}`);
  if (settings.animations) {
    grid.classList.remove('no-animations');
  } else {
    grid.classList.add('no-animations');
  }
  // sound setting stored for future use
}
