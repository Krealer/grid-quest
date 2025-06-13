export function updateHpBar(bar, current, max) {
  bar.style.width = `${(current / max) * 100}%`;
}
