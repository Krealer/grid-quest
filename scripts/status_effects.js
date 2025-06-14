// Defines positive and negative status effects that can influence
// combat and other game systems. Each effect includes logic for
// duration and its core impact on gameplay. Skills, items and enemies
// can apply these by referencing the ID.
import { addStatus, removeStatus, tickStatuses } from './status_manager.js';
import { t } from './i18n.js';

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
    }
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
    }
  },
  defense_boost: {
    id: 'defense_boost',
    name: 'Defense Boost',
    icon: '🛡️',
    description: '+2 defense for this battle.',
    type: 'positive',
    duration: 99,
    apply(target) {
      target.stats.defense += 2;
    },
    remove(target) {
      target.stats.defense -= 2;
    }
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
    }
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
    }
  },
  clarity: {
    id: 'clarity',
    name: 'Clarity',
    icon: '👁️',
    description: 'See enemy intents.',
    type: 'positive',
    duration: 3
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
    }
  },
  aegis_barrier: {
    id: 'aegis_barrier',
    name: 'Aegis Barrier',
    icon: '🛡️',
    description: 'Absorbs damage equal to half your max HP.',
    type: 'positive',
    duration: Infinity,
    apply(target) {
      target.absorb = (target.absorb || 0) + Math.floor(target.maxHp * 0.5);
    }
  },
  blessed: {
    id: 'blessed',
    name: 'Blessed',
    icon: '✨',
    description: 'Immune to one negative effect.',
    type: 'positive',
    duration: 2
  },
  empowered: {
    id: 'empowered',
    name: 'Empowered',
    icon: '⚡',
    description: 'Double skill effects.',
    type: 'positive',
    duration: 1
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
    }
  },
  invisible: {
    id: 'invisible',
    name: 'Invisible',
    icon: '👤',
    description: 'Cannot be targeted for 1 turn.',
    type: 'positive',
    duration: 1
  },
  guarded: {
    id: 'guarded',
    name: 'Guarded',
    icon: '🛡️',
    description: 'Incoming damage reduced by 50%.',
    type: 'positive',
    duration: 2,
    apply(target) {
      target.damageTakenMod = (target.damageTakenMod || 1) - 0.5;
    },
    remove(target) {
      target.damageTakenMod += 0.5;
    }
  },
  evasive: {
    id: 'evasive',
    name: 'Evasive',
    icon: '💨',
    description: '25% chance to dodge attacks.',
    type: 'positive',
    duration: 2,
    apply(target) {
      target.evasionChance = (target.evasionChance || 0) + 0.25;
    },
    remove(target) {
      target.evasionChance -= 0.25;
    }
  },
  evade_next: {
    id: 'evade_next',
    name: 'Evade Next',
    icon: '🌀',
    description: 'Next incoming attack misses.',
    type: 'positive',
    duration: 1,
    apply(target) {
      target.evadeNext = true;
    },
    remove(target) {
      target.evadeNext = false;
    }
  },
  weaken_immunity: {
    id: 'weaken_immunity',
    name: 'Weaken Immunity',
    icon: '🛡️',
    description: 'Immune to the Weakened status.',
    type: 'positive',
    duration: 3,
    apply(target) {
      if (!Array.isArray(target.passiveImmunities))
        target.passiveImmunities = [];
      if (!target.passiveImmunities.includes('weakened'))
        target.passiveImmunities.push('weakened');
    },
    remove(target) {
      if (!Array.isArray(target.passiveImmunities)) return;
      const idx = target.passiveImmunities.indexOf('weakened');
      if (idx !== -1) target.passiveImmunities.splice(idx, 1);
    }
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
    }
  },
  weakened: {
    id: 'weakened',
    name: 'Weakened',
    icon: '🤕',
    description: 'Deal half damage.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.damageModifier = (target.damageModifier || 1) * 0.5;
    },
    remove(target) {
      target.damageModifier /= 0.5;
    }
  },
  weaken: {
    id: 'weaken',
    name: 'Weaken',
    icon: '🤕',
    description: 'Deal half damage.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.damageModifier = (target.damageModifier || 1) * 0.5;
    },
    remove(target) {
      target.damageModifier /= 0.5;
    }
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
    }
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
    }
  },
  burned: {
    id: 'burned',
    name: 'Burned',
    icon: '🔥',
    description: 'Lose 1 HP per turn.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.hp = Math.max(0, target.hp - 1);
    }
  },
  burn: {
    id: 'burn',
    name: 'Burn',
    icon: '🔥',
    description: 'Lose 1 HP per turn.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.hp = Math.max(0, target.hp - 1);
    }
  },
  bleeding: {
    id: 'bleeding',
    name: 'Bleeding',
    icon: '🩸',
    description: 'Lose 1 HP per turn.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.hp = Math.max(0, target.hp - 1);
    }
  },
  paralyzed: {
    id: 'paralyzed',
    name: 'Paralyzed',
    icon: '⛔',
    description: '50% chance to skip turn.',
    type: 'negative',
    duration: 2
  },
  stunned: {
    id: 'stunned',
    name: 'Stunned',
    icon: '💫',
    description: 'Skip next turn.',
    type: 'negative',
    duration: 1
  },
  silenced: {
    id: 'silenced',
    name: 'Silenced',
    icon: '🤐',
    description: 'Cannot use offensive skills.',
    type: 'negative',
    duration: 2
  },
  silence: {
    id: 'silence',
    name: 'Silence',
    icon: '🤐',
    description: 'Cannot use offensive skills.',
    type: 'negative',
    duration: 2
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
    }
  },
  unstable: {
    id: 'unstable',
    name: 'Unstable',
    icon: '💫',
    description: '25% chance actions fail.',
    type: 'negative',
    duration: 3
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
    }
  },
  fragile: {
    id: 'fragile',
    name: 'Fragile',
    icon: '🥀',
    description: 'Take 25% more damage.',
    type: 'negative',
    duration: 3,
    apply(target) {
      target.damageTakenMod = (target.damageTakenMod || 1) + 0.25;
    },
    remove(target) {
      target.damageTakenMod -= 0.25;
    }
  },
  attack_down: {
    id: 'attack_down',
    name: 'Attack Down',
    icon: '🔻',
    description: '-2 attack.',
    type: 'negative',
    duration: 2,
    apply(target) {
      if (!target.stats) target.stats = { attack: 0, defense: 0 };
      target.stats.attack -= 2;
    },
    remove(target) {
      if (!target.stats) return;
      target.stats.attack += 2;
    }
  },
  defense_down: {
    id: 'defense_down',
    name: 'Defense Down',
    icon: '🔻',
    description: '-2 defense.',
    type: 'negative',
    duration: 2,
    apply(target) {
      if (!target.stats) target.stats = { attack: 0, defense: 0 };
      target.stats.defense -= 2;
    },
    remove(target) {
      if (!target.stats) return;
      target.stats.defense += 2;
    }
  },
  confused: {
    id: 'confused',
    name: 'Confused',
    icon: '❓',
    description: '20% chance to lose a turn.',
    type: 'negative',
    duration: 2
  },
  confuse: {
    id: 'confuse',
    name: 'Confuse',
    icon: '❓',
    description: '20% chance to lose a turn.',
    type: 'negative',
    duration: 2
  }
};

export function getStatusEffect(id) {
  const base = statusEffects[id];
  if (!base) return undefined;
  const desc = t(`status.${id}.description`);
  return {
    ...base,
    name: t(`status.${id}`),
    description: desc === '[Missing Translation]' ? base.description : desc
  };
}

export function getAllStatusEffects() {
  return statusEffects;
}

export function getStatusMetadata() {
  return Object.values(statusEffects).map((e) => ({
    id: e.id,
    name: t(`status.${e.id}`),
    description: e.description,
    type: e.type,
    temporary: typeof e.duration === 'number'
  }));
}

// convenience helpers for status manipulation
export function applyStatus(targets, id, duration) {
  const list = Array.isArray(targets) ? targets : [targets];
  list.forEach((t) => addStatus(t, id, duration));
}
export { removeStatus, tickStatuses };
