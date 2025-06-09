import { gameState } from './game_state.js';
import { disableMovement, enableMovement } from './movement.js';
import { showDialogue } from './dialogueSystem.js';
import { movePlayerTo } from './map.js';
import { unlockPassivesForLevel, getPassive } from './passive_skills.js';
import { getItemBonuses } from './item_stats.js';

export const player = {
  x: 0,
  y: 0,
  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  xpToNextLevel: 10,
  stats: {
    defense: 0,
  },
  equipment: {
    weapon: null,
    armor: null,
    accessory: null,
  },
  learnedSkills: [],
  passives: [],
  passiveImmunities: [],
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
  setTimeout(respawn, 3000);
}

export async function respawn() {
  const cols = await movePlayerTo('map01', { x: 1, y: 1 });
  player.hp = player.maxHp;
  gameState.isDead = false;
  const gridEl = document.getElementById('game-grid');
  if (gridEl) gridEl.classList.remove('death-screen');
  enableMovement();
  document.dispatchEvent(new CustomEvent('playerRespawned', { detail: { cols } }));
}

export const respawnPlayer = respawn;

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

export function levelUp() {
  player.level += 1;
  player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
  player.maxHp += 1;
  player.hp = player.maxHp;
  const unlocked = unlockPassivesForLevel(player.level);
  unlocked.forEach(id => {
    const p = getPassive(id);
    const name = p?.name || id;
    document.dispatchEvent(
      new CustomEvent('passiveUnlocked', { detail: { id, name } })
    );
  });
  document.dispatchEvent(
    new CustomEvent('playerLevelUp', { detail: { level: player.level } })
  );
  document.dispatchEvent(
    new CustomEvent('playerXpChanged', {
      detail: { xp: player.xp, level: player.level, xpToNext: player.xpToNextLevel },
    })
  );
}

export function gainXP(amount) {
  if (typeof amount !== 'number' || amount <= 0) return false;
  player.xp += amount;
  let leveled = false;
  while (player.xp >= player.xpToNextLevel) {
    player.xp -= player.xpToNextLevel;
    levelUp();
    leveled = true;
  }
  if (!leveled) {
    document.dispatchEvent(
      new CustomEvent('playerXpChanged', {
        detail: { xp: player.xp, level: player.level, xpToNext: player.xpToNextLevel },
      })
    );
  }
  return leveled;
}

export function getPlayerSummary() {
  return {
    level: player.level,
    xp: player.xp,
    xpToNextLevel: player.xpToNextLevel,
    passives: Array.isArray(player.passives) ? [...player.passives] : [],
  };
}

export function getTotalStats() {
  const base = { ...(player.stats || {}) };
  const total = { ...base };
  const eq = player.equipment || {};
  for (const slot of Object.keys(eq)) {
    const itemId = eq[slot];
    if (itemId) {
      const bonus = getItemBonuses(itemId);
      if (bonus) {
        for (const [key, val] of Object.entries(bonus)) {
          if (key === 'slot') continue;
          total[key] = (total[key] || 0) + val;
        }
      }
    }
  }
  return total;
}
