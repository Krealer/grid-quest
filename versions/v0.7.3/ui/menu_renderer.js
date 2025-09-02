export function switchSection(menuId, target) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.querySelectorAll('.info-nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });
  menu.querySelectorAll('.info-section').forEach((sec) => {
    sec.style.display = sec.id === `content-${target}` ? 'block' : 'none';
  });
}

export function initMenuNav(menuId, callback) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.querySelectorAll('.info-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchSection(menuId, btn.dataset.target);
      if (callback) callback(btn.dataset.target);
    });
  });
}
