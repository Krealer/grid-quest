export const npcInfoList = [
  { id: 'eryndor', name: 'Eryndor', description: 'Last of the Lorebound, keeper of forgotten tales.' },
  { id: 'lioran', name: 'Lioran', description: 'An eccentric mystic who speaks in riddles.' },
  { id: 'goblin_quest_giver', name: 'Goblin Trader', description: 'Trades goblin gear for mysterious rewards.' },
  { id: 'arvalin', name: 'Arvalin', description: 'A scholar fascinated by cursed artifacts.' },
  { id: 'grindle', name: 'Grindle', description: 'A gruff craftsman skilled in forging.' },
  { id: 'forge_npc', name: 'Forge Master', description: 'Offers upgrades and rerolls for equipment.' },
  { id: 'shade_sage', name: 'Shade Sage', description: 'A mysterious figure lingering in the hub.' },
  { id: 'fork_guide', name: 'Pathseer', description: 'Guides travelers through the forked pass.' },
  { id: 'watcher', name: 'Watcher', description: 'A silent guardian hidden in the shadows.' },
  { id: 'flamebound', name: 'Flamebound', description: 'A warrior devoted to the fires within the earth.' },
  { id: 'arbiter', name: 'Arbiter', description: 'Keeper of balance between shadow and flame.' }
];

export function getAllNpcs() {
  return npcInfoList;
}
