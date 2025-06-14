export function renderCategory(container, skills = [], onClick) {
  if (!container) return;
  container.innerHTML = '';
  const buttons = [];
  skills.forEach((skill) => {
    const btn = document.createElement('button');
    btn.className = 'skill-btn';
    btn.textContent = skill.name;
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      onClick?.(skill);
    });
    container.appendChild(btn);
    buttons.push(btn);
  });
}

export function switchCategory(root, name) {
  const panels = root.querySelectorAll('.tab-panel');
  panels.forEach((p) => p.classList.add('hidden'));
  const tab = root.querySelector(`.${name}-skill-buttons`);
  if (tab) tab.classList.remove('hidden');
  root
    .querySelectorAll('.combat-skill-category')
    .forEach((b) => {
      const active = b.classList.contains(`${name}-tab`);
      b.classList.toggle('selected', active);
    });
}
