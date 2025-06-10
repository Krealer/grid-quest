// Handles player stats display elements
import { player, getTotalStats } from '../player.js';
import { getRelicBonuses } from '../relic_state.js';

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
    hpDisplay.textContent = `HP: ${player.hp}/${player.maxHp + bonus}`;
  }
}

export function updateDefenseDisplay() {
  if (defenseDisplay) {
    const stats = getTotalStats();
    defenseDisplay.textContent = `Defense: ${stats.defense || 0}`;
  }
}

export function updateXpDisplay() {
  if (xpDisplay) {
    xpDisplay.textContent = `Level: ${player.level} XP: ${player.xp}/${player.xpToNextLevel}`;
  }
}
