export const enemySkills = {
  strike: {
    id: 'strike',
    name: 'Strike',
    icon: '⚔️',
    description: 'A basic attack dealing 8 damage.',
    category: 'attack',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 8 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} strikes for ${applied} damage!`);
    }
  },
  blaze_scratch: {
    id: 'blaze_scratch',
    name: 'Blaze Scratch',
    icon: '🔥',
    description: 'A fiery swipe dealing 5 damage.',
    category: 'attack',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 5 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} scorches you with a scratch for ${applied} damage!`);
    }
  },
  blaze_bite: {
    id: 'blaze_bite',
    name: 'Blaze Bite',
    icon: '🔥',
    description:
      'Bite for 5 fire damage with a 50% chance to absorb the damage dealt.',
    category: 'attack',
    cost: 0,
    cooldown: 0,
    aiType: 'damage',
    effect({ enemy, damagePlayer, log }) {
      const atk = enemy.stats?.attack || 0;
      const dmg = 5 + atk + (enemy.tempAttack || 0);
      const applied = damagePlayer(dmg);
      log(`${enemy.name} bites for ${applied} fire damage!`);
      if (Math.random() < 0.5) {
        enemy.hp = Math.min(enemy.maxHp || Infinity, enemy.hp + applied);
        log(`${enemy.name} absorbs the flames and heals for ${applied}!`);
      }
    }
  }
};

export function getEnemySkill(id) {
  return enemySkills[id];
}

export function getAllEnemySkills() {
  return enemySkills;
}

