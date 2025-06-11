export function toggleCraftMenu() {
  const overlay = document.getElementById('craft-overlay');
  const grid = document.getElementById('game-grid');
  if (!overlay || !grid) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
    grid.classList.remove('blurred', 'no-interact');
  } else {
    const list = document.getElementById('craft-list');
    if (list && list.children.length === 0) {
      list.innerHTML = '<p>No recipes unlocked yet.</p>';
    }
    overlay.classList.add('active');
    grid.classList.add('blurred', 'no-interact');
  }
}

export function initCraftMenu() {
  const overlay = document.getElementById('craft-overlay');
  const closeBtn = overlay?.querySelector('.close-btn');
  closeBtn?.addEventListener('click', toggleCraftMenu);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) toggleCraftMenu();
  });
}
