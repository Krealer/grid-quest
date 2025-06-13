// Defines skill data and manages unlocking/lookup
import { getStatusEffect } from './status_effects.js';
import { applyDamage } from './logic.js';

const skillDefs = {
  strike: {
    id: 'strike',
    name: 'Strike',
    icon: '⚔️',
    description: 'Deal damage equal to your Attack stat.',
    targetType: 'enemy',
    range: 'single',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    source: 'starter',
    // Basic attack scaled by player ATK
    effect({ user, target, log }) {
      if (target) {
        const dmg = user?.stats?.attack || 0;
        const applied = applyDamage(target, dmg);
        log(`${user.name} strikes ${target.name} for ${applied} damage!`);
      }
    }
  },
  guard: {
    id: 'guard',
    name: 'Guard',
    icon: '🛡️',
    description: 'Reduce damage from the next attack by 50%.',
    targetType: 'self',
    range: 'single',
    category: 'defensive',
    silenceExempt: true,
    cost: 0,
    cooldown: 0,
    source: 'starter',
    effect({ activateGuard, log }) {
      activateGuard();
      log('Player braces for impact.');
    }
  },
  heal: {
    id: 'heal',
    name: 'Heal',
    icon: '✨',
    description: 'Restore 20% of your max HP.',
    targetType: 'self',
    range: 'single',
    category: 'defensive',
    cost: 0,
    cooldown: 3,
    source: 'starter',
    effect({ healPlayer, player, log }) {
      const amount = Math.floor(player.maxHp * 0.2);
      healPlayer(amount);
      log(`Player heals for ${amount} HP.`);
    }
  },
  shieldWall: {
    id: 'shieldWall',
    name: 'Shield Wall',
    icon: '🛡️',
    description: 'Completely block the next attack.',
    targetType: 'self',
    range: 'single',
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
    targetType: 'enemy',
    range: 'single',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    unlockCondition: { enemy: 'E' },
    effect({ user, target, log }) {
      if (target) {
        const dmg = 10 + (user?.stats?.attack || 0);
        const applied = applyDamage(target, dmg);
        log(`${user.name} scorches ${target.name} for ${applied} damage!`);
      }
    }
  },
  shadowStab: {
    id: 'shadowStab',
    name: 'Shadow Stab',
    icon: '🌑',
    description: 'Strike from the shadows for 20 damage.',
    targetType: 'enemy',
    range: 'single',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    unlockCondition: { enemy: 'B' },
    effect({ user, target, log }) {
      if (target) {
        const dmg = 20 + (user?.stats?.attack || 0);
        const applied = applyDamage(target, dmg);
        log(`${user.name} lunges from the shadows for ${applied} damage!`);
      }
    }
  },
  boneSpike: {
    id: 'boneSpike',
    name: 'Bone Spike',
    icon: '🦴',
    description: 'Hurl bone shards for 18 damage.',
    targetType: 'enemy',
    range: 'single',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    unlockCondition: { enemy: 'S' },
    effect({ user, target, log }) {
      if (target) {
        const dmg = 18 + (user?.stats?.attack || 0);
        const applied = applyDamage(target, dmg);
        log(`${user.name} hurls bone shards for ${applied} damage!`);
      }
    }
  },
  arcaneBlast: {
    id: 'arcaneBlast',
    name: 'Arcane Blast',
    icon: '✨',
    description: 'Unleash arcane energy for 12 damage.',
    targetType: 'enemy',
    range: 'single',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    unlockCondition: { item: 'ancient_scroll' },
    effect({ user, target, log }) {
      if (target) {
        const dmg = 12 + (user?.stats?.attack || 0);
        const applied = applyDamage(target, dmg);
        log(`${user.name} blasts ${target.name} for ${applied} damage!`);
      }
    }
  },
  poisonDart: {
    id: 'poisonDart',
    name: 'Poison Dart',
    icon: '☠️',
    description: 'Inflict Poisoned for 3 turns.',
    targetType: 'enemy',
    range: 'single',
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
    targetType: 'self',
    range: 'single',
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
      'Gain a barrier equal to 50% of your max HP and remove all negative effects.',
    targetType: 'self',
    range: 'single',
    category: 'defensive',
    cost: 0,
    cooldown: 7,
    source: 'map09_floor01_chest',
    unlockCondition: { item: 'aegis_invocation_scroll' },
    effect({ applyStatus, removeNegativeStatus, player, log }) {
      applyStatus(player, 'aegis_barrier', Infinity);
      const removed = removeNegativeStatus(player);
      if (removed.length > 0) {
        const names = removed
          .map((id) => getStatusEffect(id)?.name || id)
          .join(', ');
        log(`Negative effects cleansed: ${names}`);
      }
      log('A powerful aegis surrounds you.');
    }
  },
  emberPrayer: {
    id: 'emberPrayer',
    name: 'Ember Prayer',
    icon: '🔥',
    description: 'Heal 20% of your max HP and inflict Burn for 10 turns.',
    targetType: 'enemy',
    range: 'single',
    category: 'defensive',
    cost: 0,
    cooldown: 4,
    source: 'map09_floor02_chest',
    unlockCondition: { item: 'ember_prayer_scroll' },
    effect({ healPlayer, applyStatus, enemy, player, log }) {
      const amount = Math.floor(player.maxHp * 0.2);
      healPlayer(amount);
      applyStatus(enemy, 'burn', 10);
      log('Sacred flames answer your prayer.');
    }
  },
  focusMind: {
    id: 'focusMind',
    name: 'Focus',
    icon: '🎯',
    description: 'Gain Focus for your next attack.',
    targetType: 'self',
    range: 'single',
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
    targetType: 'enemy',
    range: 'single',
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
    description: 'Deal damage equal to your ATK and heal for the damage dealt.',
    targetType: 'enemy',
    range: 'single',
    category: 'offensive',
    cost: 0,
    cooldown: 3,
    source: 'npc_syranel',
    statusEffects: ['lifesteal'],
    effect({ damageEnemy, healPlayer, log }) {
      const dealt = damageEnemy(0);
      healPlayer(dealt);
      log(`You drain ${dealt} HP from your foe.`);
    }
  },
  purify: {
    id: 'purify',
    name: 'Purify',
    icon: '💫',
    description: 'Remove certain negative effects from yourself.',
    targetType: 'self',
    range: 'single',
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

export function getSkillTargeting(id) {
  return skillDefs[id]?.targetType || 'enemy';
}
