function createPassive(def) {
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    unlockLevel: def.unlockLevel,
    apply: def.apply,
    immunity: def.immunity || [],
    itemHealBonus: def.itemHealBonus || 0,
  };
}

export const passiveDefs = {
  toughness: createPassive({
    id: 'toughness',
    name: 'Toughness',
    description: '+5 Max HP',
    unlockLevel: 3,
    apply(player) {
      player.maxHp += 5;
      player.hp = Math.min(player.hp, player.maxHp);
    },
  }),
  poisonWard: createPassive({
    id: 'poisonWard',
    name: 'Poison Ward',
    description: 'Immune to poison',
    unlockLevel: 5,
    immunity: ['poisoned'],
  }),
  potionMaster: createPassive({
    id: 'potionMaster',
    name: 'Potion Mastery',
    description: 'Potions heal for +5 HP',
    unlockLevel: 7,
    itemHealBonus: 5,
  }),
};

let playerRef = null;

function loadPassives() {
  const json = localStorage.getItem('gridquest.passives');
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function savePassives(list) {
  localStorage.setItem('gridquest.passives', JSON.stringify(list));
}

export function initPassiveSystem(playerObj) {
  playerRef = playerObj;
  if (!Array.isArray(playerRef.passives)) {
    playerRef.passives = loadPassives();
  }
  applyAllPassives();
}

function applyAllPassives() {
  if (!playerRef || !Array.isArray(playerRef.passives)) return;
  playerRef.passiveImmunities = [];
  playerRef.passives.forEach(id => {
    const p = passiveDefs[id];
    if (!p) return;
    if (typeof p.apply === 'function') p.apply(playerRef);
    if (Array.isArray(p.immunity)) {
      playerRef.passiveImmunities.push(...p.immunity);
    }
  });
}

export function unlockPassivesForLevel(level) {
  if (!playerRef) return [];
  const unlocked = [];
  for (const p of Object.values(passiveDefs)) {
    if (p.unlockLevel && level >= p.unlockLevel && !playerRef.passives.includes(p.id)) {
      playerRef.passives.push(p.id);
      unlocked.push(p.id);
    }
  }
  if (unlocked.length) {
    savePassives(playerRef.passives);
    applyAllPassives();
    document.dispatchEvent(
      new CustomEvent('passivesUpdated')
    );
  }
  return unlocked;
}

export function getPassive(id) {
  return passiveDefs[id];
}

export function getAllPassives() {
  return passiveDefs;
}
