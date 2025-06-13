export const usedItems = [];

export const itemDescriptions = {
  map02_key: 'Unlocks the door from Rainy Crossroads to Twilight Field.',
  health_potion: 'Health Potion \u2013 heals 20 HP when used in combat',
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
  psy_fiber: 'Psy Fiber \u2013 material for neural implants or debuff recipes.',
  rift_eye:
    'Rift Eye \u2013 rumored to open a psychic gate somewhere; unlocks rift gate.',
  memory_gem: 'Memory Gem \u2013 trade or socket this to improve your skills.',
  crystal_shard: 'Crystal Shard \u2013 can be used later to upgrade skills.',
  defense_potion_II:
    'Defense Potion II \u2013 grants +2 defense for the current battle.',
  rift_fragment: 'Rift Fragment \u2013 a mysterious shard sought by scholars.',
  stamina_dust:
    'Stamina Dust \u2013 instantly lowers one skill cooldown when used.',
  skill_token:
    'Skill Token \u2013 expands your maximum skill slots temporarily.',
  reflect_potion:
    'Reflect Potion \u2013 next damage you take bounces back at the attacker.',
  blood_resin:
    'Blood Resin \u2013 a rare component for advanced leech recipes.',
  echo_splinter:
    'Echo Splinter \u2013 rumor says it unlocks a dialogue option in map07.',
  prism_fragment:
    'Prism Fragment \u2013 dropped by Crystal Sentries in the maze; used for crafting.',
  crystal_seed: 'Crystal Seed \u2013 essential for future item upgrades.',
  mana_scroll: 'Mana Scroll \u2013 completely refreshes all skill cooldowns.',
  mana_ember: 'Mana Ember \u2013 restores skill energy when used in combat.',
  prism_key:
    'Prism Key \u2013 obtained from Caelen in map06, unlocks the path to the next area.',
  maze_key_1: 'Maze Key 1 \u2013 opens the western maze in the Gatepoint Room.',
  maze_key_2:
    'Maze Key 2 \u2013 unlocks the northern gate of the Gatepoint Room.',
  forgotten_ring: 'Forgotten Ring \u2013 when worn, grants +1 attack.',
  clarity_shard:
    'Clarity Shard \u2013 clears debuffs and grants Focus when used in combat.',
  gentle_flask: 'Gentle Flask \u2013 restores a little health outside combat.',
  dreamleaf: 'Dreamleaf \u2013 useful for brewing potions later.',
  sealing_dust:
    'Sealing Dust \u2013 mystical powder that dissolves the barrier to Map09.'
};

export function markItemUsed(id) {
  if (!usedItems.includes(id)) usedItems.push(id);
}
