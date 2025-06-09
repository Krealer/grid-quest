// Defines positive and negative status effects that can influence
// combat and other game systems. Each effect includes logic for
// duration and its core impact on gameplay. Skills, items and enemies
// can apply these by referencing the ID.

export const statusEffects = {
  // ---------- Positive Effects ----------
  regen: {
    id: 'regen',
    name: 'Regeneration',
    icon: '💚',
    description: 'Heal 1 HP per turn.',
    type: 'positive',
    duration: 3,
    apply(target) {
      target.hp = Math.min(target.maxHp, target.hp + 1);
    },
  },
  fortify: {
    id: 'fortify',
    name: 'Fortify',
    icon: '🛡',
    description: '+2 defense.',
    type: 'positive',
    duration: 3,
    apply(target) {
      target.stats.defense += 2;
    },
    remove(target) {
      target.stats.defense -= 2;
    },
  },
  focus: {
    id: 'focus',
    name: 'Focus',
    icon: '🎯',
    description: '+2 damage on next attack.',
    type: 'positive',
    duration: 1,
    apply(target) {
      target.bonusDamage = (target.bonusDamage || 0) + 2;
    },
    remove(target) {
      target.bonusDamage -= 2;
    },
  },
  speed_boost: {
    id: 'speed_boost',
    name: 'Speed Boost',
    icon: '💨',
    description: 'Act first in combat.',
    type: 'positive',
    duration: 2,
    apply(target) {
      target.priority = (target.priority || 0) + 1;
    },
    remove(target) {
      target.priority -= 1;
    },
  },
  clarity: {
    id: 'clarity',
    name: 'Clarity',
    icon: '👁️',
    description: 'See enemy intents.',
    type: 'positive',
    duration: 3,
  },
  barrier: {
    id: 'barrier',
    name: 'Barrier',
    icon: '🔰',
    description: 'Absorb next 5 damage.',
    type: 'positive',
    duration: 2,
    apply(target) {
      target.absorb = (target.absorb || 0) + 5;
    },
    remove(target) {
      target.absorb -= 5;
    },
  },
  blessed: {
    id: 'blessed',
    name: 'Blessed',
    icon: '✨',
    description: 'Immune to one negative effect.',
    type: 'positive',
    duration: 2,
  },
  empowered: {
    id: 'empowered',
    name: 'Empowered',
    icon: '⚡',
    description: 'Double skill effects.',
    type: 'positive',
    duration: 1,
  },
  resolve: {
    id: 'resolve',
    name: 'Resolve',
    icon: '❤️',
    description: 'Survive 1 fatal blow with 1 HP.',
    type: 'positive',
    duration: 3,
    apply(target) {
      target.hasResolve = true;
    },
    remove(target) {
      target.hasResolve = false;
    },
  },
  invisible: {
    id: 'invisible',
    name: 'Invisible',
    icon: '👤',
    description: 'Cannot be targeted for 1 turn.',
    type: 'positive',
    duration: 1,
  },

  // ---------- Negative Effects ----------
  poisoned: {
    id: 'poisoned',
    name: 'Poisoned',
    icon: '☠️',
    description: 'Lose 1 HP per turn.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.hp = Math.max(0, target.hp - 1);
    },
  },
  weakened: {
    id: 'weakened',
    name: 'Weakened',
    icon: '🤕',
    description: 'Deal half damage.',
    type: 'negative',
    duration: 2,
    apply(target) {
      target.damageModifier = (target.damageModifier || 1) * 0.5;
    },
    remove(target) {
      target.damageModifier /= 0.5;
    },
  },
  cursed: {
    id: 'cursed',
    name: 'Cursed',
    icon: '💀',
    description: 'Cannot use items.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.noItems = true;
    },
    remove(target) {
      target.noItems = false;
    },
  },
  blinded: {
    id: 'blinded',
    name: 'Blinded',
    icon: '🙈',
    description: '50% miss chance.',
    type: 'negative',
    duration: 2,
    apply(target) {
      target.missChance = (target.missChance || 0) + 0.5;
    },
    remove(target) {
      target.missChance -= 0.5;
    },
  },
  burned: {
    id: 'burned',
    name: 'Burned',
    icon: '🔥',
    description: 'Lose 2 HP when using a skill.',
    type: 'negative',
    duration: 3,
  },
  paralyzed: {
    id: 'paralyzed',
    name: 'Paralyzed',
    icon: '⛔',
    description: '50% chance to skip turn.',
    type: 'negative',
    duration: 2,
  },
  silenced: {
    id: 'silenced',
    name: 'Silenced',
    icon: '🤐',
    description: 'Cannot use skills.',
    type: 'negative',
    duration: 2,
  },
  vulnerable: {
    id: 'vulnerable',
    name: 'Vulnerable',
    icon: '💢',
    description: 'Take 50% more damage.',
    type: 'negative',
    duration: 2,
    apply(target) {
      target.damageTakenMod = (target.damageTakenMod || 1) + 0.5;
    },
    remove(target) {
      target.damageTakenMod -= 0.5;
    },
  },
  slowed: {
    id: 'slowed',
    name: 'Slowed',
    icon: '🐢',
    description: 'Act last in turn order.',
    type: 'negative',
    duration: 2,
    apply(target) {
      target.priority = (target.priority || 0) - 1;
    },
    remove(target) {
      target.priority += 1;
    },
  },
  haunted: {
    id: 'haunted',
    name: 'Haunted',
    icon: '👻',
    description: 'Cannot heal while active.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.noHealing = true;
    },
    remove(target) {
      target.noHealing = false;
    },
  },
};

export function getStatusEffect(id) {
  return statusEffects[id];
}

export function getAllStatusEffects() {
  return statusEffects;
}
