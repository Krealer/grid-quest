// Defines skill data and manages unlocking/lookup
import { applyDamage } from './logic.js';
import { t } from './i18n.js';

const skillDefs = {
  strike: {
    id: 'strike',
    get name() {
      return t('skill.strike.name');
    },
    icon: '⚔️',
    get description() {
      return t('skill.strike.description');
    },
    targetType: 'enemy',
    range: 'single',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    source: 'starter',
    // Basic attack scaled by player ATK
    effect(args) {
      const {
        caster,
        target,
        damageTarget,
        damageEnemy,
        player,
        enemy,
        log
      } = args;

      if (damageTarget && caster && target) {
        const atk = caster.stats?.attack || 0;
        const dmg = atk + (caster.tempAttack || 0);
        const applied = damageTarget(target, dmg);
        log(`${caster.name} strikes for ${applied} damage!`);
      } else if (typeof damageEnemy === 'function') {
        const applied = damageEnemy(0);
        const actorName = player?.name || caster?.name || 'Player';
        const enemyName = enemy?.name || target?.name || 'Enemy';
        log(`${actorName} strikes ${enemyName} for ${applied} damage!`);
      }
    }
  },
  guard: {
    id: 'guard',
    get name() {
      return t('skill.guard.name');
    },
    icon: '🛡️',
    get description() {
      return t('skill.guard.description');
    },
    targetType: 'self',
    range: 'single',
    category: 'defensive',
    silenceExempt: true,
    cost: 0,
    cooldown: 0,
    source: 'starter',
    effect({ caster, activateGuard, log }) {
      if (typeof activateGuard === 'function') {
        activateGuard(caster);
      } else if (caster) {
        caster.guarding = true;
      }
      if (caster) caster.hasGuard = true;
      log('Player braces for impact.');
    }
  },
  heal: {
    id: 'heal',
    get name() {
      return t('skill.heal.name');
    },
    icon: '✨',
    get description() {
      return t('skill.heal.description');
    },
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
  }
};

let player = null;

export function initSkillSystem(playerObj) {
  player = playerObj;
  if (!Array.isArray(player.learnedSkills)) {
    player.learnedSkills = [];
  }
  ['strike', 'guard', 'heal'].forEach((id) => {
    if (!player.learnedSkills.includes(id)) {
      player.learnedSkills.push(id);
    }
  });
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
