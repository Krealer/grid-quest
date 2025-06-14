export function injectMiniBars(container, actors = []) {
  if (!container) return;
  const boxes = container.querySelectorAll('.combat-box');
  boxes.forEach((box, idx) => {
    const actor = actors[idx];
    box.classList.toggle('empty', !actor);
    let icon = box.querySelector('.icon');
    if (!icon) {
      icon = document.createElement('div');
      icon.className = 'icon';
      box.appendChild(icon);
    }
    icon.textContent = actor ? actor.portrait || actor.icon || (actor.isPlayer ? '🧑' : '👾') : '';
    let hp = box.querySelector('.hp');
    if (!hp) {
      const bar = document.createElement('div');
      bar.className = 'hp-bar';
      bar.innerHTML = '<div class="hp"></div>';
      box.appendChild(bar);
      hp = bar.firstElementChild;
    }
    if (actor && actor.maxHp) {
      hp.style.width = `${(actor.hp / actor.maxHp) * 100}%`;
    } else {
      hp.style.width = '0%';
    }
  });
}
