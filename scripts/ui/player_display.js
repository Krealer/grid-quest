// Handles player stats display elements
import { player, getTotalStats } from '../player.js';
import { getRelicBonuses } from '../relic_state.js';
import { t } from '../i18n.js';

let hpDisplay;
let defenseDisplay;
let xpDisplay;

export function initPlayerDisplay() {
  hpDisplay = document.getElementById('hp-display');
  defenseDisplay = document.getElementById('defense-display');
  xpDisplay = document.getElementById('xp-display');
}

export function updateHpDisplay() {
  if (hpDisplay) {
    const bonus = getRelicBonuses().maxHp || 0;
    hpDisplay.textContent = `${t('player.hp')}: ${player.hp}/${player.maxHp + bonus}`;
  }
}

export function updateDefenseDisplay() {
  if (defenseDisplay) {
    const stats = getTotalStats();
    const def = stats.defense || 0;
    defenseDisplay.textContent = `${t('player.def')}: ${def}`;
    defenseDisplay.title =
      'Negative defense increases damage taken by 10% per point.';
    if (def < 0) defenseDisplay.classList.add('negative');
    else defenseDisplay.classList.remove('negative');
  }
}

export function updateXpDisplay() {
  if (xpDisplay) {
    xpDisplay.textContent = `${t('player.lvl')}: ${player.level} XP: ${player.xp}/${player.xpToNextLevel}`;
  }
}
