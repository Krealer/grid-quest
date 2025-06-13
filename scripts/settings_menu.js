import { setAutoBattle, isAutoBattle } from './combat_state.js';

export function initSettingsMenu() {
  const btn = document.getElementById('auto-battle-toggle-settings');
  const skip = document.getElementById('skip-toggle-settings');
  if (!btn) return;
  function update() {
    btn.textContent = isAutoBattle() ? 'Auto-Battle ON' : 'Auto-Battle OFF';
  }
  btn.addEventListener('click', () => {
    setAutoBattle(!isAutoBattle());
    update();
  });
  skip?.addEventListener('change', () => {
    const settings = JSON.parse(localStorage.getItem('gridquest.settings') || '{}');
    settings.tapToSkip = skip.checked;
    localStorage.setItem('gridquest.settings', JSON.stringify(settings));
  });
  update();
}
