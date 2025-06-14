export function renderCategory(container, skills = [], onClick) {
  if (!container) return;
  container.innerHTML = '';
  skills.forEach((skill) => {
    const btn = document.createElement('button');
    btn.className = 'skill-btn';
    btn.textContent = skill.name;
    btn.addEventListener('click', () => onClick?.(skill));
    container.appendChild(btn);
  });
}

export function switchCategory(root, name) {
  const panels = root.querySelectorAll('.tab-panel');
  panels.forEach((p) => p.classList.add('hidden'));
  const tab = root.querySelector(`.${name}-skill-buttons`);
  if (tab) tab.classList.remove('hidden');
  root
    .querySelectorAll('.combat-skill-category')
    .forEach((b) => b.classList.toggle('selected', b.classList.contains(`${name}-tab`)));
}
