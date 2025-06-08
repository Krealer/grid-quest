export const gameState = {
  currentMap: '',
  openedChests: new Set(),
  defeatedEnemies: new Set(),
  environment: 'clear',
};

export function saveState() {
  const data = {
    currentMap: gameState.currentMap,
    openedChests: Array.from(gameState.openedChests),
    defeatedEnemies: Array.from(gameState.defeatedEnemies),
  };
  localStorage.setItem('gridquest.state', JSON.stringify(data));
}

export function loadState() {
  const json = localStorage.getItem('gridquest.state');
  if (!json) return;
  try {
    const data = JSON.parse(json);
    gameState.currentMap = data.currentMap || '';
    gameState.openedChests = new Set(data.openedChests || []);
    gameState.defeatedEnemies = new Set(data.defeatedEnemies || []);
  } catch {
    // ignore malformed data
  }
}
