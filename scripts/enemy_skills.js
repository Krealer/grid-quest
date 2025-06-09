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
};

export function getEnemySkill(id) {
  return enemySkills[id];
}

export function getAllEnemySkills() {
  return enemySkills;
}
