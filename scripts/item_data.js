export const itemData = {
  map02_key: {
    id: 'map02_key',
    name: 'Map02 Key',
    description: 'Required to unlock the path to the next map.',
    type: 'key',
    tags: ['lore'],
    stackLimit: 1,
    icon: '🗝️'
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Recovers 20 HP when used in combat.',
    type: 'combat',
    tags: ['combat'],
    stackLimit: 5,
    icon: '🧪',
    useInCombat: true
  },
  health_amulet: {
    id: 'health_amulet',
    name: 'Health Amulet',
    description: 'Permanently increases max HP when found.',
    type: 'passive',
    tags: ['equipable'],
    stackLimit: 99,
    icon: '🩸'
  },
  empty_note: {
    id: 'empty_note',
    name: 'Empty Note',
    description: 'This chest was empty.',
    type: 'quest',
    tags: ['lore'],
    stackLimit: 1,
    icon: '📝'
  },
  focus_ring: {
    id: 'focus_ring',
    name: 'Focus Ring',
    description: 'Slightly improves the accuracy of all skills.',
    type: 'gear',
    tags: ['equipable'],
    stackLimit: 1,
    icon: '🎯',
    passiveModifier: { accuracy: 0.1 }
  },
  goblin_bow: {
    id: 'goblin_bow',
    name: 'Goblin Bow',
    description: 'A crude bow taken from a goblin archer.',
    type: 'gear',
    tags: ['equipable'],
    stackLimit: 1,
    icon: '🏹'
  },
  commander_badge: {
    id: 'commander_badge',
    name: 'Commander Badge',
    description: 'Proof of defeating the scout commander.',
    type: 'gear',
    tags: ['equipable'],
    stackLimit: 1,
    icon: '🎖️'
  },
  faded_blade: {
    id: 'faded_blade',
    name: 'Faded Blade',
    description:
      'A worn weapon once carried by Vaelin. Use in battle to strike harder.',
    type: 'combat',
    tags: ['combat'],
    stackLimit: 1,
    icon: '🗡️',
    useInCombat: true
  },
  scout_blade: {
    id: 'scout_blade',
    name: 'Scout Blade',
    description: 'A light blade once wielded by a goblin scout.',
    type: 'material',
    tags: ['items'],
    stackLimit: 1,
    icon: '🔪'
  },
  bone_shard: {
    id: 'bone_shard',
    name: 'Bone Shard',
    description: 'Fragment used in defense-crafting rituals.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🦴'
  },
  rotting_heart: {
    id: 'rotting_heart',
    name: 'Rotting Heart',
    description: 'Still oozing with foul ichor.',
    type: 'quest',
    tags: ['lore'],
    stackLimit: 99,
    icon: '❤️'
  },
  cracked_helmet: {
    id: 'cracked_helmet',
    name: 'Cracked Helmet',
    description: 'Offers minimal protection despite the damage.',
    type: 'gear',
    tags: ['equipable'],
    stackLimit: 1,
    icon: '🪖'
  },
  mana_gem: {
    id: 'mana_gem',
    name: 'Mana Gem',
    description: 'Refreshes all skill cooldowns once.',
    type: 'combat',
    tags: ['combat'],
    stackLimit: 99,
    icon: '🔮',
    useInCombat: true
  },
  ward_leaf: {
    id: 'ward_leaf',
    name: 'Ward Leaf',
    description: 'Used later for crafting defense-enhancing items.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🍃'
  },
  old_scroll: {
    id: 'old_scroll',
    name: 'Old Scroll',
    description: 'Triggers hidden dialogue with a future ally.',
    type: 'quest',
    tags: ['lore'],
    stackLimit: 1,
    icon: '📜'
  },
  arcane_spark: {
    id: 'arcane_spark',
    name: 'Arcane Spark',
    description: 'Unleashes a burst damaging all foes once per battle.',
    type: 'combat',
    tags: ['combat'],
    stackLimit: 3,
    icon: '✨',
    useInCombat: true
  },
  sentry_plating: {
    id: 'sentry_plating',
    name: 'Sentry Plating',
    description: 'Metal scrap useful for future armor crafting.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🛡️'
  },
  chaos_organ: {
    id: 'chaos_organ',
    name: 'Chaos Organ',
    description: 'Rare organ from rift creatures used in potent fusions.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🧬'
  },
  void_residue: {
    id: 'void_residue',
    name: 'Void Residue',
    description: 'Traded among scholars for high-level crafting.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🕳️'
  },
  crystal_shard: {
    id: 'crystal_shard',
    name: 'Crystal Shard',
    description: 'A faintly glowing fragment used for skill upgrades.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🔷'
  },
  defense_potion_II: {
    id: 'defense_potion_II',
    name: 'Defense Potion II',
    description: 'Increases defense by 2 for this fight.',
    type: 'combat',
    tags: ['combat'],
    stackLimit: 10,
    icon: '🧴',
    useInCombat: true
  },
  flesh_crystal: {
    id: 'flesh_crystal',
    name: 'Flesh Crystal',
    description: 'Used to enhance life-based skills (future).',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🧬'
  },
  crystal_dust: {
    id: 'crystal_dust',
    name: 'Crystal Dust',
    description: 'Required for crafting crystalline armor later.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '✨'
  },
  psy_fiber: {
    id: 'psy_fiber',
    name: 'Psy Fiber',
    description: 'Component in neural implants or debuff skills.',
    type: 'material',
    tags: ['items'],
    stackLimit: 99,
    icon: '🧠'
  },
  rift_eye: {
    id: 'rift_eye',
    name: 'Rift Eye',
    description: 'May open a sealed psychic gate elsewhere.',
    type: 'key',
    tags: ['lore'],
    stackLimit: 1,
    icon: '👁️'
  },
  memory_gem: {
    id: 'memory_gem',
    name: 'Memory Gem',
    description: 'Can be socketed or traded for a skill token.',
    type: 'material',
    tags: ['lore'],
    stackLimit: 99,
    icon: '🔮'
  },
  rift_fragment: {
    id: 'rift_fragment',
    name: 'Rift Fragment',
    description: 'A fragment pulsing with dimensional energy.',
    type: 'quest',
    tags: ['lore'],
    stackLimit: 1,
    icon: '💠'
  }
};

export function getItemDataLocal(id) {
  return itemData[id];
}
