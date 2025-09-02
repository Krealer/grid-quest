let container = null;

function ensureContainer() {
  if (!container) {
    container = document.getElementById('message-log');
    if (!container) {
      container = document.createElement('div');
      container.id = 'message-log';
      document.body.appendChild(container);
    }
  }
}

export function logMessage(text) {
  ensureContainer();
  if (!text) return;
  const entry = document.createElement('div');
  entry.textContent = text;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
  setTimeout(() => entry.remove(), 4000);
}

