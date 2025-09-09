// Defines skill data and manages unlocking/lookup
import { getStatusEffect } from './status_effects.js';

const skillDefs = {
  strike: {
    id: 'strike',
    name: 'Strike',
    icon: '⚔️',
    description: 'Deal damage equal to your Attack stat.',
    category: 'attack',
    cost: 0,
    cooldown: 0,
    source: 'starter',
    // Basic attack scaled by player ATK
    effect({ damageEnemy, log }) {
      const dealt = damageEnemy(0, null);
      log(`Zealer strikes for ${dealt} damage!`);
    }
  },
  guard: {
    id: 'guard',
    name: 'Guard',
    icon: '🛡️',
    description: 'Nullify the next incoming damage.',
    category: 'non-attack',
    silenceExempt: true,
    cost: 0,
    cooldown: 4,
    source: 'starter',
    effect({ activateShieldBlock, log }) {
      activateShieldBlock();
      log('Zealer braces for impact.');
    }
  },
  fire_slash: {
    id: 'fire_slash',
    name: 'Fire Slash',
    icon: '🔥',
    description: 'Deal damage equal to your Attack stat.',
    category: 'attack',
    cost: 0,
    cooldown: 4,
    source: 'starter',
    effect({ damageEnemy, log }) {
      const dealt = damageEnemy(0, 'fire');
      log(`Zealer's fire slash deals ${dealt} damage!`);
    }
  },
  aegisInvocation: {
    id: 'aegisInvocation',
    name: 'Aegis Invocation',
    icon: '🛡️',
    description:
      'Gain a barrier equal to 50% of your max HP and remove all negative effects.',
    category: 'non-attack',
    cost: 0,
    cooldown: 7,
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
    category: 'non-attack',
    cost: 0,
    cooldown: 4,
    unlockCondition: { item: 'ember_prayer_scroll' },
    effect({ healPlayer, applyStatus, enemy, player, log }) {
      const amount = Math.floor(player.maxHp * 0.2);
      healPlayer(amount);
      applyStatus(enemy, 'burn', 10);
      log('Sacred flames answer your prayer.');
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
  ['strike', 'guard', 'fire_slash'].forEach((id) => {
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
