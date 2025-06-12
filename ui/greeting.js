export function initGreeting(startCallback) {
  const greetOverlay = document.getElementById('greeting-overlay');
  const howtoOverlay = document.getElementById('howto-overlay');
  const playBtn = document.getElementById('greet-play-btn');
  const howBtn = document.getElementById('greet-howto-btn');
  const howClose = howtoOverlay?.querySelector('.close-btn');

  function showHowto() {
    howtoOverlay?.classList.add('active');
  }

  function hideHowto() {
    howtoOverlay?.classList.remove('active');
  }

  function startGame() {
    greetOverlay?.classList.remove('active');
    localStorage.setItem('tutorialComplete', 'true');
    if (typeof startCallback === 'function') startCallback();
  }

  playBtn?.addEventListener('click', startGame);
  howBtn?.addEventListener('click', showHowto);
  howClose?.addEventListener('click', hideHowto);
  howtoOverlay?.addEventListener('click', (e) => {
    if (e.target === howtoOverlay) hideHowto();
  });

  return { startGame, showGreeting: () => greetOverlay?.classList.add('active') };
}
