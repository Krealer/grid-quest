export const itemData = {
  map02_key: {
    id: 'map02_key',
    name: 'Map02 Key',
    description: 'Required to unlock the path to the next map.',
    type: 'key',
    stackLimit: 1,
    icon: '🗝️'
  },
  health_amulet: {
    id: 'health_amulet',
    name: 'Health Amulet',
    description: 'Permanently increases max HP when found.',
    type: 'passive',
    stackLimit: 99,
    icon: '🩸'
  },
  empty_note: {
    id: 'empty_note',
    name: 'Empty Note',
    description: 'This chest was empty.',
    type: 'quest',
    stackLimit: 1,
    icon: '📝'
  },
  focus_ring: {
    id: 'focus_ring',
    name: 'Focus Ring',
    description: 'Slightly improves the accuracy of all skills.',
    type: 'gear',
    stackLimit: 1,
    icon: '🎯',
    passiveModifier: { accuracy: 0.1 }
  },
  goblin_bow: {
    id: 'goblin_bow',
    name: 'Goblin Bow',
    description: 'A crude bow taken from a goblin archer.',
    type: 'gear',
    stackLimit: 1,
    icon: '🏹'
  },
  commander_badge: {
    id: 'commander_badge',
    name: 'Commander Badge',
    description: 'Proof of defeating the scout commander.',
    type: 'gear',
    stackLimit: 1,
    icon: '🎖️'
  },
  faded_blade: {
    id: 'faded_blade',
    name: 'Faded Blade',
    description:
      'A worn weapon once carried by Vaelin. Use in battle to strike harder.',
    type: 'combat',
    stackLimit: 1,
    icon: '🗡️'
  },
  scout_blade: {
    id: 'scout_blade',
    name: 'Scout Blade',
    description: 'A light blade once wielded by a goblin scout.',
    type: 'material',
    stackLimit: 1,
    icon: '🔪'
  },
  bone_shard: {
    id: 'bone_shard',
    name: 'Bone Shard',
    description: 'Fragment used in defense-crafting rituals.',
    type: 'material',
    stackLimit: 99,
    icon: '🦴'
  },
  cracked_helmet: {
    id: 'cracked_helmet',
    name: 'Cracked Helmet',
    description: 'Offers minimal protection despite the damage.',
    type: 'gear',
    stackLimit: 1,
    icon: '🪖'
  }
};

export function getItemDataLocal(id) {
  return itemData[id];
}
