export function showSystemMessage(text, duration = 2000) {
  if (!text) return;
  let box = document.getElementById('system-message');
  if (!box) {
    box = document.createElement('div');
    box.id = 'system-message';
    document.body.appendChild(box);
  }
  box.textContent = text;
  box.classList.add('active');
  setTimeout(() => {
    box.classList.remove('active');
  }, duration);
}

document.addEventListener('blueprintUnlocked', () => {
  showSystemMessage('🧪 New crafting blueprint unlocked!');
});
