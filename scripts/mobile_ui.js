import { gameState } from './game_state.js';

export const isMobilePortrait = () =>
  window.innerWidth < 768 && window.innerHeight > window.innerWidth;

export function centerGridOnPlayer(container) {
  const playerTile = container.querySelector('.tile.player');
  if (!playerTile) return;
  const rect = playerTile.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  const scrollX = rect.left - cRect.left + rect.width / 2 - cRect.width / 2;
  const scrollY = rect.top - cRect.top + rect.height / 2 - cRect.height / 2;
  container.scrollBy(scrollX, scrollY);
}

export function initMobileCenter(container) {
  document.addEventListener('playerMoved', () => {
    if (!gameState.settings?.centerMode) return;
    if (!isMobilePortrait()) return;
    centerGridOnPlayer(container);
  });
}
