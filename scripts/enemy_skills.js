import { getEchoConversationCount } from './player_memory.js';
import { getOwnedRelics } from './relic_state.js';

export const enemySkills = {
  strike: {
    id: 'strike',
    name: 'Strike',
    icon: '⚔️',
    description: 'A basic attack dealing 8 damage.',
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'defensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'offensive',
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
    category: 'defensive',
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
    category: 'offensive',
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
  },
  bleed_claw: {
    id: 'bleed_claw',
    name: 'Bleeding Claw',
    icon: '🩸',
    description: 'Quick strike that causes bleeding.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['bleeding'],
    statuses: [{ target: 'player', id: 'bleeding', duration: 3 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 6 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'bleeding', 3);
      log(`${enemy.name} slashes for ${applied} damage and causes bleeding!`);
    }
  },
  rift_touch: {
    id: 'rift_touch',
    name: 'Rift Touch',
    icon: '💫',
    description: 'Inflicts the Unstable status on the target.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['unstable'],
    statuses: [{ target: 'player', id: 'unstable', duration: 3 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 5 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'unstable', 3);
      log(`${enemy.name} touches you for ${applied} damage. Reality wavers!`);
    }
  },
  arcane_bolt: {
    id: 'arcane_bolt',
    name: 'Arcane Bolt',
    icon: '✨',
    description: 'A burst of arcane energy dealing 7 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 7 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} hurls an arcane bolt for ${applied} damage!`);
    }
  },
  weakening_hex: {
    id: 'weakening_hex',
    name: 'Weakening Hex',
    icon: '🌀',
    description: 'Applies Weakened for 3 turns.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['weakened'],
    statuses: [{ target: 'player', id: 'weakened', duration: 3 }],
    effect({ enemy, player, applyStatus, log }) {
      applyStatus(player, 'weakened', 3);
      log(`${enemy.name} hexes you with weakening magic!`);
    }
  },
  slam: {
    id: 'slam',
    name: 'Slam',
    icon: '🔨',
    description: 'Basic smash dealing 8 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 8 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} slams for ${applied} damage!`);
    }
  },
  grasp: {
    id: 'grasp',
    name: 'Grasp',
    icon: '✋',
    description: 'Deals 5 damage and slows the target.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['slowed'],
    statuses: [{ target: 'player', id: 'slowed', duration: 2 }],
    effect({ enemy, damagePlayer, applyStatus, log, player }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 5 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'slowed', 2);
      log(`${enemy.name} grasps you for ${applied} damage!`);
    }
  },
  shard_spike: {
    id: 'shard_spike',
    name: 'Shard Spike',
    icon: '❄️',
    description: 'Piercing strike that ignores some defense.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 7 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg + 1);
      log(`${enemy.name} launches a shard spike for ${applied} damage!`);
    }
  },
  reflect_shell: {
    id: 'reflect_shell',
    name: 'Reflect Shell',
    icon: '🛡️',
    description: 'Raises defense by 2 for 3 turns.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    effect({ enemy, log }) {
      enemy.tempDefense = (enemy.tempDefense || 0) + 2;
      log(`${enemy.name}'s crystals harden! (+2 defense)`);
    }
  },
  prism_shot: {
    id: 'prism_shot',
    name: 'Prism Shot',
    icon: '🔶',
    description: 'Deals 6 damage and inflicts Weakened.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['weakened'],
    statuses: [{ target: 'player', id: 'weakened', duration: 2 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 6 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'weakened', 2);
      log(`${enemy.name} fires a prism shot for ${applied} damage!`);
    }
  },
  refract_guard: {
    id: 'refract_guard',
    name: 'Refract Guard',
    icon: '🔷',
    description: 'Reduces damage taken next turn.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    effect({ enemy, log, activateEnemyGuard }) {
      enemy.tempDefense = (enemy.tempDefense || 0) + 1;
      if (activateEnemyGuard) activateEnemyGuard();
      log(`${enemy.name} refracts incoming attacks! (+1 defense)`);
    }
  },
  neural_lash: {
    id: 'neural_lash',
    name: 'Neural Lash',
    icon: '🔱',
    description: 'Psychic strike dealing 9 damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 9 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} lashes your mind for ${applied} damage!`);
    }
  },
  confuse: {
    id: 'confuse',
    name: 'Confuse',
    icon: '💫',
    description: 'Befuddles the foe with psychic noise.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['confused'],
    statuses: [{ target: 'player', id: 'confused', duration: 2 }],
    effect({ player, applyStatus, log, enemy }) {
      applyStatus(player, 'confused', 2);
      log(`${enemy.name} warps your senses!`);
    }
  },
  fracture_wave: {
    id: 'fracture_wave',
    name: 'Fracture Wave',
    icon: '🌊',
    description: 'Pulse of mental force.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 8 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} emits a fracture wave for ${applied} damage!`);
    }
  },
  mind_spike: {
    id: 'mind_spike',
    name: 'Mind Spike',
    icon: '🧠',
    description: 'High magic damage to a single target.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 12 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} drives a mind spike for ${applied} damage!`);
    }
  },
  echo_wound: {
    id: 'echo_wound',
    name: 'Echo Wound',
    icon: '🔔',
    description: 'Inflicts Fragile for 3 turns.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['fragile'],
    statuses: [{ target: 'player', id: 'fragile', duration: 3 }],
    effect({ player, applyStatus, log, enemy }) {
      applyStatus(player, 'fragile', 3);
      log(`${enemy.name} rends your psyche, leaving you fragile!`);
    }
  },
  silence_wave: {
    id: 'silence_wave',
    name: 'Silencing Wave',
    icon: '🔇',
    description: 'Disrupts magic, applying Silence.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['silence'],
    statuses: [{ target: 'player', id: 'silence', duration: 2 }],
    effect({ enemy, player, applyStatus, log }) {
      applyStatus(player, 'silence', 2);
      log(`${enemy.name} emits a wave of silence!`);
    }
  }
};

export function getEnemySkill(id) {
  return enemySkills[id];
}

export function getAllEnemySkills() {
  return enemySkills;
}
