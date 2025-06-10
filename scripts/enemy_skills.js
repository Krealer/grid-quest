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
    }
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
    }
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
    }
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
    }
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
    }
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
  scratch: {
    id: 'scratch',
    name: 'Scratch',
    icon: '🗡️',
    description: 'A quick swipe dealing 7 damage.',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 7 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} scratches for ${applied} damage!`);
    }
  },
  decay_touch: {
    id: 'decay_touch',
    name: 'Decay Touch',
    icon: '☠️',
    description: 'Weak necrotic attack that curses the target.',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['cursed'],
    statuses: [{ target: 'player', id: 'cursed', duration: 2 }],
    effect({ enemy, damagePlayer, applyStatus, log, player }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 4 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'cursed', 2);
      log(`${enemy.name} spreads decay for ${applied} damage!`);
    }
  },
  piercing_arrow: {
    id: 'piercing_arrow',
    name: 'Piercing Arrow',
    icon: '🏹',
    description: '6 damage that partially ignores defense.',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 6 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg + 1);
      log(`${enemy.name} fires a piercing arrow for ${applied} damage!`);
    }
  },
  decay_blow: {
    id: 'decay_blow',
    name: 'Decay Blow',
    icon: '🪓',
    description: '8 damage with a chance to inflict Weakened.',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['weakened'],
    statuses: [{ target: 'player', id: 'weakened', duration: 2 }],
    effect({ enemy, damagePlayer, applyStatus, log, player }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 8 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      if (Math.random() < 0.5) {
        applyStatus(player, 'weakened', 2);
        log('You feel your strength fading!');
      }
      log(`${enemy.name} crushes for ${applied} damage!`);
    }
  },
  power_slash: {
    id: 'power_slash',
    name: 'Power Slash',
    icon: '💥',
    description: 'A heavy swing dealing significant damage.',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 10 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} unleashes a power slash for ${applied} damage!`);
    }
  },
  call_backup: {
    id: 'call_backup',
    name: 'Call Backup',
    icon: '📣',
    description: 'Rallies allies to increase attack.',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    effect({ enemy, log }) {
      enemy.tempAttack = (enemy.tempAttack || 0) + 2;
      log(`${enemy.name} calls for backup, bolstering its strength!`);
    }
  },
  crush_defense: {
    id: 'crush_defense',
    name: 'Crush Defense',
    icon: '🔨',
    description: 'Damages and makes the target vulnerable.',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['vulnerable'],
    statuses: [{ target: 'player', id: 'vulnerable', duration: 2 }],
    effect({ enemy, damagePlayer, applyStatus, log, player }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 7 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'vulnerable', 2);
      log(`${enemy.name} crushes your guard for ${applied} damage!`);
    }
  }
};

export function getEnemySkill(id) {
  return enemySkills[id];
}

export function getAllEnemySkills() {
  return enemySkills;
}
