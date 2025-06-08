export const gameState = {
  currentMap: '',
  openedChests: new Set(),
  defeatedEnemies: new Set(),
  environment: 'clear',
  maxHpBonus: 0,
};

export function saveState() {
  const data = {
    currentMap: gameState.currentMap,
    openedChests: Array.from(gameState.openedChests),
    defeatedEnemies: Array.from(gameState.defeatedEnemies),
    maxHpBonus: gameState.maxHpBonus,
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
    gameState.maxHpBonus = data.maxHpBonus || 0;
  } catch {
    // ignore malformed data
  }
}
