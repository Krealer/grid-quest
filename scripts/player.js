export const player = {
  x: 0,
  y: 0,
  hp: 100,
  maxHp: 100,
  learnedSkills: [],
};

export function moveTo(x, y) {
  player.x = x;
  player.y = y;
}

export function takeDamage(amount) {
  player.hp = Math.max(0, player.hp - amount);
}

export function healFull() {
  player.hp = player.maxHp;
}

export function increaseMaxHp(amount) {
  player.maxHp += amount;
  player.hp = Math.min(player.hp, player.maxHp);
}
