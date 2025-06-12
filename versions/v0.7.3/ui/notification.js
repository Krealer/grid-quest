export function notify(text) {
  if (!text) return;
  let container = document.getElementById('message-log');
  if (!container) {
    container = document.createElement('div');
    container.id = 'message-log';
    document.body.appendChild(container);
  }
  const entry = document.createElement('div');
  entry.textContent = text;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
  setTimeout(() => entry.remove(), 2000);
}

