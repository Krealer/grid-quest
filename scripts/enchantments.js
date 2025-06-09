export const enchantments = {
  fire: {
    name: 'of Fire',
    bonuses: { attack: 1 }
  },
  fortitude: {
    name: 'of Fortitude',
    bonuses: { defense: 1 }
  }
};

export function getEnchantmentData(id) {
  return enchantments[id] || null;
}

export function getRandomEnchantment() {
  const keys = Object.keys(enchantments);
  return keys[Math.floor(Math.random() * keys.length)];
}
