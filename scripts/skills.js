// Defines skill data and manages unlocking/lookup
import { getStatusEffect } from './status_effects.js';

const skillDefs = {
  strike: {
    id: 'strike',
    name: 'Strike',
    icon: '⚔️',
    description: 'Deal 15 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
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
    icon: '🛡️',
    description: 'Reduce damage from the next attack.',
    category: 'defensive',
    silenceExempt: true,
    cost: 0,
    cooldown: 0,
    effect({ activateGuard, log }) {
      activateGuard();
      log('Player braces for impact.');
    }
  },
  heal: {
    id: 'heal',
    name: 'Heal',
    icon: '✨',
    description: 'Restore 20 HP. Can be used once per battle.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
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
    icon: '🛡️',
    description: 'Completely block the next attack.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    unlockCondition: { chest: 'map01:11,3' },
    effect({ activateShieldBlock, log }) {
      activateShieldBlock();
      log('A sturdy wall of force surrounds you.');
    }
  },
  flameBurst: {
    id: 'flameBurst',
    name: 'Flame Burst',
    icon: '🔥',
    description: 'Engulf the foe in flames for 10 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
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
    icon: '🌑',
    description: 'Strike from the shadows for 20 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
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
    icon: '🦴',
    description: 'Hurl bone shards for 18 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
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
    icon: '✨',
    description: 'Unleash arcane energy for 12 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
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
    icon: '☠️',
    description: 'Inflict Poisoned for 3 turns.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    statuses: [{ target: 'enemy', id: 'poisoned', duration: 3 }],
    effect({ applyStatus, enemy, log }) {
      applyStatus(enemy, 'poisoned', 3);
      log('Enemy is poisoned!');
    }
  },
  rally: {
    id: 'rally',
    name: 'Rally',
    icon: '📣',
    description: 'Gain Fortify for 3 turns.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    statuses: [{ target: 'self', id: 'fortify', duration: 3 }],
    effect({ applyStatus, player, log }) {
      applyStatus(player, 'fortify', 3);
      log('You steel yourself against attacks.');
    }
  },
  aegisInvocation: {
    id: 'aegisInvocation',
    name: 'Aegis Invocation',
    icon: '🛡️',
    description:
      'Gain a barrier equal to half your max HP and immunity to Weakened for 3 turns.',
    category: 'defensive',
    cost: 0,
    cooldown: 4,
    unlockCondition: { item: 'aegis_invocation_scroll' },
    effect({ applyStatus, player, log }) {
      applyStatus(player, 'aegis_barrier', Infinity);
      applyStatus(player, 'weaken_immunity', 3);
      log('A powerful aegis surrounds you.');
    }
  },
  emberPrayer: {
    id: 'emberPrayer',
    name: 'Ember Prayer',
    icon: '🔥',
    description: 'Deal fire damage and apply Burn for 3 turns.',
    category: 'offensive',
    cost: 0,
    cooldown: 2,
    unlockCondition: { item: 'ember_prayer_scroll' },
    effect({ damageEnemy, applyStatus, enemy, log }) {
      const dmg = 16;
      damageEnemy(dmg);
      applyStatus(enemy, 'burn', 3);
      log('Sacred flames sear the foe!');
    }
  },
  focusMind: {
    id: 'focusMind',
    name: 'Focus',
    icon: '🎯',
    description: 'Gain Focus for your next attack.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    statuses: [{ target: 'self', id: 'focus', duration: 1 }],
    effect({ applyStatus, player, log }) {
      applyStatus(player, 'focus', 1);
      log('You concentrate deeply, preparing your strike.');
    }
  },
  focusStrike: {
    id: 'focus_strike',
    name: 'Focus Strike',
    icon: '🎯',
    description: 'A precise attack that rarely misses.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    effect({ damageEnemy, log }) {
      const dmg = 18;
      damageEnemy(dmg);
      log(`Your focus strike deals ${dmg} damage!`);
    }
  },
  leech: {
    id: 'leech',
    name: 'Leech',
    icon: '🩸',
    description: 'Deal 15 damage and heal 15 HP.',
    category: 'offensive',
    cost: 0,
    cooldown: 2,
    effect({ damageEnemy, healPlayer, log }) {
      const dmg = 15;
      damageEnemy(dmg);
      healPlayer(15);
      log(`You drain life for ${dmg} damage and healing.`);
    }
  },
  purify: {
    id: 'purify',
    name: 'Purify',
    icon: '💫',
    description: 'Remove certain negative effects from yourself.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
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
