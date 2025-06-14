let container = null;

export function initLog(el) {
  container = el;
  if (container) container.innerHTML = '';
}

export function append(message) {
  if (!container) return;
  const div = document.createElement('div');
  div.textContent = message;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
