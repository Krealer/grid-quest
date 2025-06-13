export function getXpThreshold(level) {
  let threshold = 10;
  const lvl = Math.max(1, Math.floor(level));
  for (let i = 1; i < lvl; i++) {
    threshold = Math.floor(threshold * 1.5);
  }
  return threshold;
}
