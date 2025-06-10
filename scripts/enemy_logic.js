export function isElite(enemy) {
  return enemy?.type === 'elite';
}

export function isBoss(enemy) {
  return enemy?.boss === true;
}
