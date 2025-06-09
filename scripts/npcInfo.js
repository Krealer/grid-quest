export const npcInfoList = [
  { id: 'eryndor', name: 'Eryndor', description: 'Last of the Lorebound, keeper of forgotten tales.' },
  { id: 'lioran', name: 'Lioran', description: 'An eccentric mystic who speaks in riddles.' },
  { id: 'goblin_quest_giver', name: 'Goblin Trader', description: 'Trades goblin gear for mysterious rewards.' },
  { id: 'arvalin', name: 'Arvalin', description: 'A scholar fascinated by cursed artifacts.' },
  { id: 'grindle', name: 'Grindle', description: 'A gruff craftsman skilled in forging.' },
  { id: 'forge_npc', name: 'Forge Master', description: 'Offers upgrades and rerolls for equipment.' }
];

export function getAllNpcs() {
  return npcInfoList;
}
