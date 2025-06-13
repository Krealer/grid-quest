export function modifyStats(target, changes = {}) {
  if (!target) return;
  if (!target.stats) target.stats = { attack: 0, defense: 0, speed: 0 };
  for (const [k, v] of Object.entries(changes)) {
    target.stats[k] = (target.stats[k] || 0) + v;
  }
}
