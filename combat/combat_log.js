let container = null;

export function initLog(el) {
  container = el;
  if (container) container.innerHTML = '';
}

export function log(message) {
  const logBox = container || document.querySelector('.combat-log');
  if (!logBox) return;
  const entry = document.createElement('div');
  entry.textContent = message;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight;
}
