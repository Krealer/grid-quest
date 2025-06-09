// Defines skill data and manages unlocking/lookup
import { getStatusEffect } from './status_effects.js';

const skillDefs = {
  strike: {
    id: 'strike',
    name: 'Strike',
    description: 'Deal 15 damage.',
    // Basic attack
    effect({ damageEnemy, log }) {
      const dmg = 15;
      damageEnemy(dmg);
      log(`Player strikes for ${dmg} damage!`);
    }
  },
  guard: {
    id: 'guard',
    name: 'Guard',
    description: 'Reduce damage from the next attack.',
    effect({ activateGuard, log }) {
      activateGuard();
      log('Player braces for impact.');
    }
  },
  heal: {
    id: 'heal',
    name: 'Heal',
    description: 'Restore 20 HP. Can be used once per battle.',
    effect({ healPlayer, log, isHealUsed, setHealUsed }) {
      if (isHealUsed()) {
        log('Heal can only be used once!');
        return false;
      }
      setHealUsed();
      healPlayer(20);
      log('Player heals for 20 HP.');
    }
  },
  shieldWall: {
    id: 'shieldWall',
    name: 'Shield Wall',
    description: 'Completely block the next attack.',
    unlockCondition: { chest: 'map01:11,3' },
    effect({ activateShieldBlock, log }) {
      activateShieldBlock();
      log('A sturdy wall of force surrounds you.');
    }
  },
  flameBurst: {
    id: 'flameBurst',
    name: 'Flame Burst',
    description: 'Engulf the foe in flames for 10 damage.',
    unlockCondition: { enemy: 'E' },
    effect({ damageEnemy, log }) {
      const dmg = 10;
      damageEnemy(dmg);
      log('Flames scorch the enemy for 10 damage!');
    }
  },
  shadowStab: {
    id: 'shadowStab',
    name: 'Shadow Stab',
    description: 'Strike from the shadows for 20 damage.',
    unlockCondition: { enemy: 'B' },
    effect({ damageEnemy, log }) {
      const dmg = 20;
      damageEnemy(dmg);
      log('You lunge from the darkness for 20 damage!');
    }
  },
  boneSpike: {
    id: 'boneSpike',
    name: 'Bone Spike',
    description: 'Hurl bone shards for 18 damage.',
    unlockCondition: { enemy: 'S' },
    effect({ damageEnemy, log }) {
      const dmg = 18;
      damageEnemy(dmg);
      log('Bone shards pierce the foe for 18 damage!');
    }
  },
  arcaneBlast: {
    id: 'arcaneBlast',
    name: 'Arcane Blast',
    description: 'Unleash arcane energy for 12 damage.',
    unlockCondition: { item: 'ancient_scroll' },
    effect({ damageEnemy, log }) {
      const dmg = 12;
      damageEnemy(dmg);
      log('Arcane power lashes out for 12 damage!');
    }
  },
  poisonDart: {
    id: 'poisonDart',
    name: 'Poison Dart',
    description: 'Inflict Poisoned for 3 turns.',
    statuses: [{ target: 'enemy', id: 'poisoned', duration: 3 }],
    effect({ applyStatus, enemy, log }) {
      applyStatus(enemy, 'poisoned', 3);
      log('Enemy is poisoned!');
    }
  },
  rally: {
    id: 'rally',
    name: 'Rally',
    description: 'Gain Fortify for 3 turns.',
    statuses: [{ target: 'self', id: 'fortify', duration: 3 }],
    effect({ applyStatus, player, log }) {
      applyStatus(player, 'fortify', 3);
      log('You steel yourself against attacks.');
    }
  },
  focusMind: {
    id: 'focusMind',
    name: 'Focus',
    description: 'Gain Focus for your next attack.',
    statuses: [{ target: 'self', id: 'focus', duration: 1 }],
    effect({ applyStatus, player, log }) {
      applyStatus(player, 'focus', 1);
      log('You concentrate deeply, preparing your strike.');
    }
  },
  purify: {
    id: 'purify',
    name: 'Purify',
    description: 'Remove certain negative effects from yourself.',
    cleanse: ['poisoned', 'cursed', 'blinded'],
    effect({ player, removeNegativeStatus, log }) {
      const removed = removeNegativeStatus(player, [
        'poisoned',
        'cursed',
        'blinded'
      ]);
      if (removed.length > 0) {
        const names = removed
          .map((id) => getStatusEffect(id)?.name || id)
          .join(', ');
        log(`Purify cleanses ${names}!`);
      } else {
        log('No negative effects to purify.');
      }
    }
  }
};

let player = null;
const enemySkillSources = new Set();

function loadEnemySkillSources() {
  const json = localStorage.getItem('gridquest.enemySkillSources');
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function saveEnemySkillSources(list) {
  localStorage.setItem('gridquest.enemySkillSources', JSON.stringify(list));
}

function loadLearnedSkills() {
  const json = localStorage.getItem('gridquest.skills');
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function saveLearnedSkills(list) {
  localStorage.setItem('gridquest.skills', JSON.stringify(list));
}

export function initSkillSystem(playerObj) {
  player = playerObj;
  if (!Array.isArray(player.learnedSkills)) {
    player.learnedSkills = loadLearnedSkills();
  }
  const enemyList = loadEnemySkillSources();
  enemyList.forEach((id) => enemySkillSources.add(id));
  // Ensure starting skills are present
  ['strike', 'guard', 'heal'].forEach((id) => {
    if (!player.learnedSkills.includes(id)) {
      player.learnedSkills.push(id);
    }
  });
  saveLearnedSkills(player.learnedSkills);
}

export function unlockSkill(id) {
  if (!player) return false;
  if (!player.learnedSkills.includes(id)) {
    player.learnedSkills.push(id);
    saveLearnedSkills(player.learnedSkills);
    return true;
  }
  return false;
}

export function isEnemySourceUsed(id) {
  return enemySkillSources.has(id);
}

export function markEnemySource(id) {
  if (!enemySkillSources.has(id)) {
    enemySkillSources.add(id);
    saveEnemySkillSources(Array.from(enemySkillSources));
  }
}

export function unlockSkillsFromItem(itemId) {
  const unlocked = [];
  for (const [id, skill] of Object.entries(skillDefs)) {
    if (skill.unlockCondition?.item === itemId) {
      if (unlockSkill(id)) {
        unlocked.push(id);
      }
    }
  }
  return unlocked;
}

export function unlockSkillsFromRelic(relicId) {
  const unlocked = [];
  for (const [id, skill] of Object.entries(skillDefs)) {
    if (skill.unlockCondition?.relic === relicId) {
      if (unlockSkill(id)) {
        unlocked.push(id);
      }
    }
  }
  return unlocked;
}

export function hasSkill(id) {
  return player ? player.learnedSkills.includes(id) : false;
}

export function getSkill(id) {
  return skillDefs[id];
}

export function getAllSkills() {
  return skillDefs;
}
