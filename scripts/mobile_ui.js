import { gameState } from './game_state.js';

export function initMobileCenter(container) {
  document.addEventListener('playerMoved', () => {
    if (!gameState.settings?.centerMode) return;
    if (window.innerWidth > window.innerHeight) return;
    const playerTile = container.querySelector('.player');
    if (!playerTile) return;
    const rect = playerTile.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const offsetX = rect.left - cRect.left - container.clientWidth / 2 + rect.width / 2;
    const offsetY = rect.top - cRect.top - container.clientHeight / 2 + rect.height / 2;
    container.scrollLeft += offsetX;
    container.scrollTop += offsetY;
  });
}
