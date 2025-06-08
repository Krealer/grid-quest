// Defines skill data and manages unlocking/lookup

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
    },
  },
  guard: {
    id: 'guard',
    name: 'Guard',
    description: 'Reduce damage from the next attack.',
    effect({ activateGuard, log }) {
      activateGuard();
      log('Player braces for impact.');
    },
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
    },
  },
  shieldWall: {
    id: 'shieldWall',
    name: 'Shield Wall',
    description: 'Completely block the next attack.',
    unlockCondition: { chest: 'map01:11,3' },
    effect({ activateShieldBlock, log }) {
      activateShieldBlock();
      log('A sturdy wall of force surrounds you.');
    },
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
    },
  },
};

let player = null;

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
  // Ensure starting skills are present
  ['strike', 'guard', 'heal'].forEach(id => {
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

export function hasSkill(id) {
  return player ? player.learnedSkills.includes(id) : false;
}

export function getSkill(id) {
  return skillDefs[id];
}

export function getAllSkills() {
  return skillDefs;
}
