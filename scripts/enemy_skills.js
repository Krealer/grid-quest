import { getEchoConversationCount } from './player_memory.js';
import { getOwnedRelics } from './relic_state.js';

export const enemySkills = {
  strike: {
    id: 'strike',
    name: 'Strike',
    description: 'A basic attack dealing 8 damage.',
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const dmg = 8 + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} strikes for ${applied} damage!`);
    },
  },
  poisonSting: {
    id: 'poisonSting',
    name: 'Poison Sting',
    description: 'Deal 5 damage and inflict Poisoned.',
    aiType: 'status',
    applies: ['poisoned'],
    statuses: [{ target: 'player', id: 'poisoned', duration: 2 }],
    effect({ enemy, player, damagePlayer, applyStatus, log }) {
      const dmg = 5 + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      applyStatus(player, 'poisoned', 2);
      log(`${enemy.name} stings for ${applied} damage and poisons you!`);
    },
  },
  weaken: {
    id: 'weaken',
    name: 'Weaken',
    description: 'Inflict Weakened for 2 turns.',
    aiType: 'status',
    applies: ['weakened'],
    statuses: [{ target: 'player', id: 'weakened', duration: 2 }],
    effect({ player, applyStatus, log, enemy }) {
      applyStatus(player, 'weakened', 2);
      log(`${enemy.name} casts weaken!`);
    },
  },
  memorySurge: {
    id: 'memorySurge',
    name: 'Memory Surge',
    description: 'Damage increases with every echo remembered.',
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const count = getEchoConversationCount();
      const dmg = 10 + count * 2 + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} unleashes memories for ${applied} damage!`);
    },
  },
  relicGuard: {
    id: 'relicGuard',
    name: 'Relic Guard',
    description: 'Raises defense based on relics owned.',
    aiType: 'buff',
    effect({ enemy, log }) {
      const relics = getOwnedRelics().length;
      const amount = relics * 2;
      enemy.tempDefense = (enemy.tempDefense || 0) + amount;
      log(`${enemy.name} hardens with relic power (+${amount} defense)!`);
    },
  },
};

export function getEnemySkill(id) {
  return enemySkills[id];
}

export function getAllEnemySkills() {
  return enemySkills;
}
