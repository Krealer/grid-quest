// Handles player stats display elements
import { player, getTotalStats } from '../player.js';
import { getRelicBonuses } from '../relic_state.js';

let hpDisplay;
let defenseDisplay;
let levelDisplay;

export function initPlayerDisplay() {
  hpDisplay = document.getElementById('hp-display');
  defenseDisplay = document.getElementById('defense-display');
  levelDisplay = document.getElementById('xp-display');
}

export function updateHpDisplay() {
  if (hpDisplay) {
    const bonus = getRelicBonuses().maxHp || 0;
    hpDisplay.textContent = `HP: ${player.hp}/${player.maxHp + bonus}`;
  }
}

export function updateDefenseDisplay() {
  if (defenseDisplay) {
    const stats = getTotalStats();
    const def = stats.defense || 0;
    defenseDisplay.textContent = `Defense: ${def}`;
    defenseDisplay.title =
      'Negative defense increases damage taken by 10% per point.';
    if (def < 0) defenseDisplay.classList.add('negative');
    else defenseDisplay.classList.remove('negative');
  }
}

export function updateXpDisplay() {
  if (levelDisplay) {
    levelDisplay.textContent = `Level: ${player.level}`;
  }
}
