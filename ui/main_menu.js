import { player, getTotalStats } from '../scripts/player.js';
import { hasCodeFile } from '../scripts/inventory.js';
import { toggleQuestLog } from '../scripts/quest_log.js';
import { toggleInfoMenu } from './info_menu.js';
import { toggleStatusPanel } from '../scripts/menu/status.js';
import { toggleNullSummary } from './null_summary.js';

export function updateMenuStats() {
  const el = document.getElementById('menu-stats');
  if (!el) return;
  const stats = getTotalStats();
  el.innerHTML = `
    <div>Level: ${player.level}</div>
    <div>XP: ${player.xp} / ${player.xpToNextLevel}</div>
    <div>HP: ${player.hp} / ${player.maxHp}</div>
    <div>ATK: ${stats.attack || 0}</div>
    <div>DEF: ${stats.defense || 0}</div>
  `;
}

function updateNullButton() {
  const btn = document.querySelector('#menu-overlay .null-tab');
  if (!btn) return;
  btn.style.display = hasCodeFile() ? 'inline-block' : 'none';
}

export function toggleMainMenu() {
  const overlay = document.getElementById('menu-overlay');
  const grid = document.getElementById('game-grid');
  if (!overlay || !grid) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
    grid.classList.remove('blurred', 'no-interact');
  } else {
    updateMenuStats();
    updateNullButton();
    overlay.classList.add('active');
    grid.classList.add('blurred', 'no-interact');
  }
}

export function initMainMenu() {
  const menuBtn = document.querySelector('#menu-bar .menu-tab');
  const closeBtn = document.querySelector('#menu-overlay .close-btn');
  menuBtn?.addEventListener('click', toggleMainMenu);
  closeBtn?.addEventListener('click', toggleMainMenu);
  const overlay = document.getElementById('menu-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) toggleMainMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('active')) {
      toggleMainMenu();
    }
  });
  document
    .querySelector('#menu-overlay .quests-tab')
    ?.addEventListener('click', () => {
      toggleMainMenu();
      toggleQuestLog();
    });
  document
    .querySelector('#menu-overlay .info-tab')
    ?.addEventListener('click', () => {
      toggleMainMenu();
      toggleInfoMenu();
    });
  document
    .querySelector('#menu-overlay .status-tab')
    ?.addEventListener('click', () => {
      toggleMainMenu();
      toggleStatusPanel();
    });
  document
    .querySelector('#menu-overlay .null-tab')
    ?.addEventListener('click', () => {
      toggleMainMenu();
      toggleNullSummary();
    });

  document.addEventListener('inventoryUpdated', updateNullButton);
  document.addEventListener('playerHpChanged', updateMenuStats);
  document.addEventListener('playerXpChanged', updateMenuStats);
  document.addEventListener('playerLevelUp', updateMenuStats);
  document.addEventListener('equipmentChanged', updateMenuStats);
}
