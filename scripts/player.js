import { gameState } from './game_state.js';
import { disableMovement, enableMovement } from './movement.js';
import { showDialogue } from './dialogue_system.js';
import { movePlayerTo } from './map.js';
import { transitionToMap } from './transition.js';
import { handleMoveCorruption } from './corruption_state.js';
import { isMobilePortrait, centerGridOnPlayer } from './mobile_ui.js';
import { unlockPassivesForLevel, getPassive } from './passive_skills.js';
import { getItemBonuses } from './item_stats.js';
import { getRelicBonuses } from './relic_state.js';
import { getClassBonuses, getChosenClass } from './class_state.js';
import { unlockSkill, getAllSkills } from './skills.js';
import {
  addItem,
  removeItem as removeInvItem,
  getPassiveModifiers,
  recalcPassiveModifiers,
  isEquipped
} from './inventory.js';
import { checkTempleSet } from './equipment.js';

export function updatePassiveEffects() {
  const hasTempleSet =
    isEquipped('temple_sword') &&
    isEquipped('temple_shell') &&
    isEquipped('temple_ring');
  player.hasTemplePassive = hasTempleSet;
}

export const player = {
  x: 0,
  y: 0,
  hp: 100,
  maxHp: 100,
  atk: 15,
  def: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 10,
  classId: getChosenClass() || null,
  stats: {
    attack: 0,
    defense: 0
  },
  equipment: {
    weapon: null,
    armor: null,
    accessory: null
  },
  learnedSkills: [],
  passives: [],
  passiveImmunities: [],
  tempDefense: 0,
  tempAttack: 0,
  hasTemplePassive: false,
  statuses: [],
  isPlayer: true
};

export function calculateStatsFromLevel(level) {
  const lvl = level;
  const milestoneHp = Math.floor(lvl / 5) * 2 + Math.floor(lvl / 10) * 2;
  const maxHp = 100 + lvl * 2 + milestoneHp;
  const attack = 15 + Math.floor(lvl / 5);
  const defense = Math.floor(lvl / 10);
  return { maxHp, defense, attack };
}

export function updateStatsFromLevel() {
  const { maxHp, defense, attack } = calculateStatsFromLevel(player.level);
  player.maxHp = maxHp;
  player.atk = attack;
  player.def = defense;
  if (!player.stats) player.stats = { attack: 0, defense: 0 };
  player.stats.defense = 0;
  player.stats.attack = 0;
  if (player.hp > player.maxHp) player.hp = player.maxHp;
}

export function moveTo(x, y) {
  player.x = x;
  player.y = y;
}

export function stepTo(x, y) {
  player.x = x;
  player.y = y;
  handleMoveCorruption(x, y);
  document.dispatchEvent(new CustomEvent('playerMoved', { detail: { x, y } }));
  if (gameState.settings?.centerMode && isMobilePortrait()) {
    const container = document.getElementById('game-grid');
    if (container) {
      centerGridOnPlayer(container);
    }
  }
}

export function takeDamage(amount) {
  player.hp = Math.max(0, player.hp - amount);
  if (player.hp === 0) triggerDeath();
}

export function loseHpNonLethal(amount) {
  if (typeof amount !== 'number' || amount <= 0) return;
  player.hp = Math.max(1, player.hp - amount);
  document.dispatchEvent(
    new CustomEvent('playerHpChanged', { detail: { hp: player.hp, maxHp: player.maxHp } })
  );
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
  document.dispatchEvent(
    new CustomEvent('playerRespawned', { detail: { cols } })
  );
}

export const respawnPlayer = respawn;

export function healFull() {
  player.hp = player.maxHp;
}

export function healToFull() {
  player.hp = player.maxHp;
  document.dispatchEvent(
    new CustomEvent('playerHpChanged', {
      detail: { hp: player.hp, maxHp: player.maxHp }
    })
  );
}

export function increaseMaxHp(amount) {
  if (typeof amount !== 'number' || amount === 0) return;
  player.maxHp += amount;
  player.hp = Math.min(player.hp, player.maxHp);
  document.dispatchEvent(
    new CustomEvent('playerHpChanged', {
      detail: { hp: player.hp, maxHp: player.maxHp }
    })
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
  updateStatsFromLevel();
  player.hp = player.maxHp;
  const unlocked = unlockPassivesForLevel(player.level);
  unlocked.forEach((id) => {
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
      detail: {
        xp: player.xp,
        level: player.level,
        xpToNext: player.xpToNextLevel
      }
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
        detail: {
          xp: player.xp,
          level: player.level,
          xpToNext: player.xpToNextLevel
        }
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
    classId: player.classId,
    passives: Array.isArray(player.passives) ? [...player.passives] : []
  };
}

export function serializePlayer() {
  return {
    x: player.x,
    y: player.y,
    level: player.level,
    xp: player.xp,
    xpToNextLevel: player.xpToNextLevel,
    stats: {
      attack: player.stats?.attack || 0,
      defense: player.stats?.defense || 0
    },
    learnedSkills: Array.isArray(player.learnedSkills)
      ? [...player.learnedSkills]
      : [],
    equipment: { ...player.equipment }
  };
}

export function deserializePlayer(data) {
  if (!data) return;
  player.x = data.x ?? player.x;
  player.y = data.y ?? player.y;
  player.level = data.level ?? player.level;
  player.xp = data.xp ?? player.xp;
  player.xpToNextLevel = data.xpToNextLevel ?? player.xpToNextLevel;
  if (data.stats) {
    if (!player.stats) player.stats = { attack: 0, defense: 0 };
    player.stats.attack = data.stats.attack ?? player.stats.attack;
    player.stats.defense = data.stats.defense ?? player.stats.defense;
  }
  // derived stats will be recalculated from the level
  if (Array.isArray(data.learnedSkills)) {
    player.learnedSkills = [...data.learnedSkills];
  }
  if (data.equipment) {
    player.equipment.weapon = data.equipment.weapon || null;
    player.equipment.armor = data.equipment.armor || null;
    player.equipment.accessory = data.equipment.accessory || null;
    recalcPassiveModifiers();
    checkTempleSet();
    updatePassiveEffects();
    document.dispatchEvent(new CustomEvent('equipmentChanged'));
  }
  updateStatsFromLevel();
  player.hp = player.maxHp;
}

export function getTotalStats() {
  const base = {
    attack: (player.atk || 0) + (player.stats?.attack || 0),
    defense: (player.def || 0) + (player.stats?.defense || 0)
  };
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
  const relicBonus = getRelicBonuses();
  if (relicBonus) {
    for (const [key, val] of Object.entries(relicBonus)) {
      total[key] = (total[key] || 0) + val;
    }
  }
  const passiveMods = getPassiveModifiers();
  for (const [key, val] of Object.entries(passiveMods)) {
    total[key] = (total[key] || 0) + val;
  }
  const classBonus = getClassBonuses();
  if (classBonus) {
    for (const [key, val] of Object.entries(classBonus)) {
      if (key === 'itemHealBonus') continue;
      total[key] = (total[key] || 0) + val;
    }
  }
  return total;
}

export function grantSkill(id) {
  if (unlockSkill(id)) {
    const skill = getAllSkills()[id];
    if (skill) {
      showDialogue(`You've learned a new skill: ${skill.name}!`);
    }
  }
}

export function obtainItem(id, qty = 1) {
  addItem({ id, quantity: qty });
}

export function loseItem(id, qty = 1) {
  removeInvItem(id, qty);
}

export async function enterDoor(target, spawn) {
  const { cols } = await transitionToMap(target, spawn);
  return cols;
}

export function reapplyEquipmentBonuses() {
  recalcPassiveModifiers();
  checkTempleSet();
  updatePassiveEffects();
  document.dispatchEvent(new CustomEvent('equipmentChanged'));
}

// initialize stats based on starting level
updateStatsFromLevel();
updatePassiveEffects();
