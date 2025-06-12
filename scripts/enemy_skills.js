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
    description: '50 magic damage that lowers the caster\'s defense by 30.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const applied = damagePlayer(50);
      enemy.stats.defense = (enemy.stats?.defense || 0) - 30;
      log(`${enemy.name} releases a blinding prism shot for ${applied} damage!`);
    }
  },
  refract_guard: {
    id: 'refract_guard',
    name: 'Refract Guard',
    icon: '🔷',
    description: 'Permanently increases defense by 1.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    effect({ enemy, log }) {
      enemy.stats.defense = (enemy.stats?.defense || 0) + 1;
      log(`${enemy.name}'s facets harden! (+1 defense)`);
    }
  },
  refract_crack: {
    id: 'refract_crack',
    name: 'Refract Crack',
    icon: '🔷',
    description: 'Permanently increases defense by 2.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    effect({ enemy, log }) {
      enemy.stats.defense = (enemy.stats?.defense || 0) + 2;
      log(`${enemy.name}'s cracked shards realign! (+2 defense)`);
    }
  },
  prism_crack: {
    id: 'prism_crack',
    name: 'Prism Crack',
    icon: '🔶',
    description: 'Crushing prism blast for 100 damage that lowers defense by 30.',
    category: 'offensive',
    cost: 0,
    cooldown: 10,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const applied = damagePlayer(100);
      enemy.stats.defense = (enemy.stats?.defense || 0) - 30;
      log(`${enemy.name} unleashes a prism crack for ${applied} damage!`);
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
  },
  pillar_slam: {
    id: 'pillar_slam',
    name: 'Pillar Slam',
    icon: '🏛️',
    description: 'Crushing strike that deals heavy damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 12 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} slams a pillar for ${applied} damage!`);
    }
  },
  sanctified_guard: {
    id: 'sanctified_guard',
    name: 'Sanctified Guard',
    icon: '🛡️',
    description: 'Reduces incoming damage by half for 2 turns.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    statuses: [{ target: 'self', id: 'guarded', duration: 2 }],
    effect({ enemy, applyStatus, log }) {
      applyStatus(enemy, 'guarded', 2);
      log(`${enemy.name} braces behind sacred wards!`);
    }
  },
  ward_pulse: {
    id: 'ward_pulse',
    name: 'Ward Pulse',
    icon: '📿',
    description: 'Emits a weakening pulse with no damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['weakened'],
    statuses: [{ target: 'player', id: 'weakened', duration: 2 }],
    effect({ enemy, player, applyStatus, log }) {
      applyStatus(player, 'weakened', 2);
      log(`${enemy.name}'s ward pulse saps your strength!`);
    }
  },
  silent_revelation: {
    id: 'silent_revelation',
    name: 'Silent Revelation',
    icon: '🕯️',
    description: 'Silences the foe for 1 turn.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['silence'],
    statuses: [{ target: 'player', id: 'silence', duration: 1 }],
    effect({ enemy, player, applyStatus, log }) {
      applyStatus(player, 'silence', 1);
      log(`${enemy.name} unveils a silent revelation!`);
    }
  },
  fragmented_chant: {
    id: 'fragmented_chant',
    name: 'Fragmented Chant',
    icon: '🎶',
    description: 'Moderate magic damage with a chance to confuse.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    applies: ['confused'],
    statuses: [{ target: 'player', id: 'confused', duration: 2 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 7 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      if (Math.random() < 0.1) {
        applyStatus(player, 'confused', 2);
        log('You are disoriented by the chant!');
      }
      log(`${enemy.name} intones a fragmented chant for ${applied} damage!`);
    }
  },
  still_mind: {
    id: 'still_mind',
    name: 'Still Mind',
    icon: '🧘',
    description: 'Gain 25% evasion for 2 turns.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    statuses: [{ target: 'self', id: 'evasive', duration: 2 }],
    effect({ enemy, applyStatus, log }) {
      applyStatus(enemy, 'evasive', 2);
      log(`${enemy.name} enters a still meditative stance.`);
    }
  },
  oathfire_slash: {
    id: 'oathfire_slash',
    name: 'Oathfire Slash',
    icon: '🔥',
    description: 'Strikes and burns the enemy.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['burned'],
    statuses: [{ target: 'player', id: 'burned', duration: 3 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 9 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'burned', 3);
      log(`${enemy.name} slashes with oathfire for ${applied} damage!`);
    }
  },
  ashen_oath: {
    id: 'ashen_oath',
    name: 'Ashen Oath',
    icon: '⚔️',
    description: 'Sacrifices HP to deal heavy damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const loss = Math.max(1, Math.floor(enemy.maxHp * 0.1));
      enemy.hp = Math.max(0, enemy.hp - loss);
      log(`${enemy.name} sacrifices ${loss} HP!`);
      const atk = enemy.stats?.attack || 0;
      const dmg = 12 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name}'s oath burns for ${applied} damage!`);
    }
  },
  searing_trial: {
    id: 'searing_trial',
    name: 'Searing Trial',
    icon: '🔥',
    description: 'Burns and weakens the foe. Cooldown 3 turns.',
    category: 'offensive',
    cost: 0,
    cooldown: 3,
    aiType: 'status',
    applies: ['burned', 'weakened'],
    statuses: [
      { target: 'player', id: 'burned', duration: 3 },
      { target: 'player', id: 'weakened', duration: 2 }
    ],
    effect({ player, applyStatus, log, damagePlayer, enemy }) {
      applyStatus(player, 'burned', 3);
      applyStatus(player, 'weakened', 2);
      log(`${enemy.name} subjects you to a searing trial!`);
    }
  },
  kindled_touch: {
    id: 'kindled_touch',
    name: 'Kindled Touch',
    icon: '🔥',
    description: 'Melee strike that burns the target.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['burn'],
    statuses: [{ target: 'player', id: 'burn', duration: 2 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 6 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'burn', 2);
      log(`${enemy.name} scorches you for ${applied} damage!`);
    }
  },
  ashburst: {
    id: 'ashburst',
    name: 'Ashburst',
    icon: '💥',
    description: 'Explodes on death, burning the foe.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    applies: ['burn'],
    statuses: [{ target: 'player', id: 'burn', duration: 1 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 8 + atk;
      const applied = damagePlayer(dmg);
      applyStatus(player, 'burn', 1);
      log(`${enemy.name} erupts in ash for ${applied} damage!`);
    }
  },
  resonant_pulse: {
    id: 'resonant_pulse',
    name: 'Resonant Pulse',
    icon: '🔔',
    description: '15 magic damage with a chance to confuse.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    applies: ['confuse'],
    statuses: [{ target: 'player', id: 'confuse', duration: 2 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 15 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      if (Math.random() < 0.3) {
        applyStatus(player, 'confuse', 2);
        log('The pulse leaves you disoriented!');
      }
      log(`${enemy.name}'s pulse hits for ${applied} damage!`);
    }
  },
  null_chime: {
    id: 'null_chime',
    name: 'Null Chime',
    icon: '🔕',
    description: 'Lowers defense for 2 turns.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['defense_down'],
    statuses: [{ target: 'player', id: 'defense_down', duration: 2 }],
    effect({ enemy, player, applyStatus, log }) {
      applyStatus(player, 'defense_down', 2);
      log(`${enemy.name} tolls a nullifying chime!`);
    }
  },
  meditate: {
    id: 'meditate',
    name: 'Meditate',
    icon: '🧘',
    description: 'Regenerates 10 HP.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    effect({ enemy, log }) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + 10);
      log(`${enemy.name} focuses and recovers!`);
    }
  },
  dust_hex: {
    id: 'dust_hex',
    name: 'Dust Hex',
    icon: '🌫️',
    description: 'Weakens attack and saps strength.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['attack_down', 'weaken'],
    statuses: [
      { target: 'player', id: 'attack_down', duration: 2 },
      { target: 'player', id: 'weaken', duration: 2 }
    ],
    effect({ enemy, player, applyStatus, log }) {
      applyStatus(player, 'attack_down', 2);
      applyStatus(player, 'weaken', 2);
      log(`${enemy.name} whispers a dust hex!`);
    }
  },
  mirage_form: {
    id: 'mirage_form',
    name: 'Mirage Form',
    icon: '✨',
    description: 'Creates an illusory clone.',
    category: 'defensive',
    cost: 0,
    cooldown: 0,
    aiType: 'buff',
    statuses: [{ target: 'self', id: 'evade_next', duration: 1 }],
    effect({ enemy, applyStatus, log }) {
      applyStatus(enemy, 'evade_next', 1);
      log(`${enemy.name} splits into mirage images.`);
    }
  },
  silt_veil: {
    id: 'silt_veil',
    name: 'Silt Veil',
    icon: '🌫️',
    description: 'Evades the next attack. Cooldown 3 turns.',
    category: 'defensive',
    cost: 0,
    cooldown: 3,
    aiType: 'buff',
    statuses: [{ target: 'self', id: 'evade_next', duration: 1 }],
    effect({ enemy, applyStatus, log }) {
      applyStatus(enemy, 'evade_next', 1);
      log(`${enemy.name} shrouds itself in silt.`);
    }
  },
  hollow_wail: {
    id: 'hollow_wail',
    name: 'Hollow Wail',
    icon: '🔊',
    description: 'Sound blast that silences the foe.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'status',
    applies: ['silence'],
    statuses: [{ target: 'player', id: 'silence', duration: 1 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 8 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'silence', 1);
      log(`${enemy.name} unleashes a hollow wail for ${applied} damage!`);
    }
  },
  despair_note: {
    id: 'despair_note',
    name: 'Despair Note',
    icon: '🎵',
    description: 'A resonant note of shadow.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, applyStatus, log, player }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 10 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      if (Math.random() < 0.2) {
        applyStatus(player, 'silence', 1);
        log('The note reverberates, stifling your voice!');
      }
      log(`${enemy.name} strikes a despairing note for ${applied} damage!`);
    }
  },
  stone_pulse: {
    id: 'stone_pulse',
    name: 'Stone Pulse',
    icon: '🪨',
    description: 'Shockwave dealing moderate physical damage.',
    category: 'offensive',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 9 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} sends a stone pulse for ${applied} damage!`);
    }
  },
  sacred_bind: {
    id: 'sacred_bind',
    name: 'Sacred Bind',
    icon: '⛓️',
    description: 'Silences the foe for 3 turns.',
    category: 'offensive',
    cost: 0,
    cooldown: 3,
    aiType: 'status',
    applies: ['silence'],
    statuses: [{ target: 'player', id: 'silence', duration: 3 }],
    effect({ enemy, player, applyStatus, log }) {
      applyStatus(player, 'silence', 3);
      log(`${enemy.name} binds you in sacred silence!`);
    }
  },
  blessed_quake: {
    id: 'blessed_quake',
    name: 'Blessed Quake',
    icon: '💥',
    description: 'Quake that may paralyze the foe.',
    category: 'offensive',
    cost: 0,
    cooldown: 2,
    aiType: 'damage',
    applies: ['paralyzed'],
    statuses: [{ target: 'player', id: 'paralyzed', duration: 1 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 7 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'paralyzed', 1);
      log(`${enemy.name} invokes a blessed quake for ${applied} damage!`);
    }
  }
};

export function getEnemySkill(id) {
  return enemySkills[id];
}

export function getAllEnemySkills() {
  return enemySkills;
}
