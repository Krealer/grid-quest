import { gameState } from './game_state.js';
import { disableMovement, enableMovement } from './movement.js';
import { showDialogue } from './dialogueSystem.js';
import { loadMap } from './router.js';

export const player = {
  x: 0,
  y: 0,
  hp: 100,
  maxHp: 100,
  stats: {
    defense: 0,
  },
  learnedSkills: [],
  bonusHpGiven: {},
  tempDefense: 0,
  tempAttack: 0,
  statuses: [],
};

export function moveTo(x, y) {
  player.x = x;
  player.y = y;
}

export function takeDamage(amount) {
  player.hp = Math.max(0, player.hp - amount);
  if (player.hp === 0) triggerDeath();
}

export function isAlive() {
  return player.hp > 0;
}

export function triggerDeath() {
  gameState.isDead = true;
  disableMovement();
  const gridEl = document.getElementById('game-grid');
  if (gridEl) gridEl.classList.add('death-screen');
  showDialogue('You have fallen... but not forever.');
  setTimeout(respawnPlayer, 3000);
}

export async function respawnPlayer() {
  const { cols } = await loadMap('map01.json', { x: 1, y: 1 });
  player.hp = player.maxHp;
  gameState.isDead = false;
  const gridEl = document.getElementById('game-grid');
  if (gridEl) gridEl.classList.remove('death-screen');
  enableMovement();
  document.dispatchEvent(new CustomEvent('playerRespawned', { detail: { cols } }));
}

export function healFull() {
  player.hp = player.maxHp;
}

export function increaseMaxHp(amount) {
  player.maxHp += amount;
  player.hp = Math.min(player.hp, player.maxHp);
}

export function increaseDefense(amount) {
  if (!player.stats) player.stats = { defense: 0 };
  player.stats.defense = (player.stats.defense || 0) + amount;
  document.dispatchEvent(
    new CustomEvent('playerDefenseChanged', { detail: { defense: player.stats.defense } })
  );
}

export function addTempDefense(amount) {
  player.tempDefense = (player.tempDefense || 0) + amount;
}

export function addTempAttack(amount) {
  player.tempAttack = (player.tempAttack || 0) + amount;
}

export function resetTempStats() {
  player.tempDefense = 0;
  player.tempAttack = 0;
}
