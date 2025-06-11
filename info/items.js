export const usedItems = [];

export const itemDescriptions = {
  map02_key: 'Unlocks the door from Rainy Crossroads to Twilight Field.',
  health_potion: 'Health Potion \u2013 permanently increases max HP by 1',
  health_amulet: 'Health Amulet \u2013 increases max HP by 2 when crafted',
  empty_note: 'The note is blank, leaving more questions than answers.',
  focus_ring: 'A ring that sharpens concentration, boosting accuracy by 10%',
  commander_badge: 'Grants access from Twilight Field to Central Hub.',
  faded_blade:
    "Vaelin's old weapon. Using it in combat grants +2 attack for that battle.",
  mana_gem:
    'Mana Gem \u2013 found in Isolation Nexus. Using it in combat refreshes all skill cooldowns.',
  arcane_spark:
    'Arcane Spark \u2013 once per battle, deals 6 damage to every enemy.',
  ward_leaf:
    'Ward Leaf \u2013 a crafting material discovered in Isolation Nexus, prized for defensive rituals.',
  old_scroll:
    'Old Scroll \u2013 a weathered document from Isolation Nexus. Someone may want to read it later.',
  rift_stone:
    'Rift Stone \u2013 unlocks the sealed gate in Isolation Nexus after defeating the Rift Lurker.',
  flesh_crystal:
    'Flesh Crystal \u2013 enhances life-based skills in future updates.',
  crystal_dust:
    'Crystal Dust \u2013 key component for crystalline armor crafting.',
  psy_fiber:
    'Psy Fiber \u2013 material for neural implants or debuff recipes.',
  rift_eye:
    'Rift Eye \u2013 rumored to open a psychic gate somewhere.',
  memory_gem:
    'Memory Gem \u2013 trade or socket this to improve your skills.',
  crystal_shard: 'Crystal Shard \u2013 can be used later to upgrade skills.',
  defense_potion_II:
    'Defense Potion II \u2013 grants +2 defense for the current battle.',
  rift_fragment: 'Rift Fragment \u2013 a mysterious shard sought by scholars.'
};

export function markItemUsed(id) {
  if (!usedItems.includes(id)) usedItems.push(id);
}
