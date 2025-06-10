import { getEchoConversationCount } from './player_memory.js';
import { getOwnedRelics } from './relic_state.js';

export const enemySkills = {
  strike: {
    id: 'strike',
    name: 'Strike',
    icon: '⚔️',
    description: 'A basic attack dealing 8 damage.',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 8 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} strikes for ${applied} damage!`);
    },
  },
  poisonSting: {
    id: 'poisonSting',
    name: 'Poison Sting',
    icon: '☠️',
    description: 'Deal 5 damage and inflict Poisoned.',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['poisoned'],
    statuses: [{ target: 'player', id: 'poisoned', duration: 2 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 5 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'poisoned', 2);
      log(`${enemy.name} stings for ${applied} damage and poisons you!`);
    },
  },
  weaken: {
    id: 'weaken',
    name: 'Weaken',
    icon: '🤕',
    description: 'Inflict Weakened for 2 turns.',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['weakened'],
    statuses: [{ target: 'player', id: 'weakened', duration: 2 }],
    effect({ player, applyStatus, log, enemy }) {
      applyStatus(player, 'weakened', 2);
      log(`${enemy.name} casts weaken!`);
    },
  },
  memorySurge: {
    id: 'memorySurge',
    name: 'Memory Surge',
    icon: '💥',
    description: 'Damage increases with every echo remembered.',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const count = getEchoConversationCount();
      const atk = enemy.stats?.attack || 0;
      const dmg = 10 + count * 2 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} unleashes memories for ${applied} damage!`);
    },
  },
  relicGuard: {
    id: 'relicGuard',
    name: 'Relic Guard',
    icon: '🛡️',
    description: 'Raises defense based on relics owned.',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    effect({ enemy, log }) {
      const relics = getOwnedRelics().length;
      const amount = relics * 2;
      enemy.tempDefense = (enemy.tempDefense || 0) + amount;
      log(`${enemy.name} hardens with relic power (+${amount} defense)!`);
    },
  },
  shadowBolt: {
    id: 'shadowBolt',
    name: 'Shadow Bolt',
    icon: '🌑',
    description: '6 damage and inflicts Haunted.',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['haunted'],
    statuses: [{ target: 'player', id: 'haunted', duration: 2 }],
    effect({ enemy, damagePlayer, applyStatus, log, player }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 6 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'haunted', 2);
      log(`${enemy.name} fires a shadow bolt for ${applied} damage!`);
    }
  },
  emberBite: {
    id: 'emberBite',
    name: 'Ember Bite',
    icon: '🔥',
    description: 'Chomp for 6 damage and burn the target.',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['burned'],
    statuses: [{ target: 'player', id: 'burned', duration: 2 }],
    effect({ enemy, damagePlayer, applyStatus, log, player }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 6 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'burned', 2);
      log(`${enemy.name} bites for ${applied} damage and burns you!`);
    }
  },
};

export function getEnemySkill(id) {
  return enemySkills[id];
}

export function getAllEnemySkills() {
  return enemySkills;
}
