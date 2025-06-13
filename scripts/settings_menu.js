import { setAutoBattle, isAutoBattle } from './combat_state.js';

export function initSettingsMenu() {
  const btn = document.getElementById('auto-battle-toggle-settings');
  if (!btn) return;
  function update() {
    btn.textContent = isAutoBattle() ? 'Auto-Battle ON' : 'Auto-Battle OFF';
  }
  btn.addEventListener('click', () => {
    setAutoBattle(!isAutoBattle());
    update();
  });
  update();
}
