let mode = 'save';

export function initSaveSlotsMenu() {
  const overlay = document.getElementById('save-load-overlay');
  if (!overlay) return;
  const close = overlay.querySelector('.close-btn');
  if (close) close.addEventListener('click', hideMenu);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideMenu();
  });
}

function hideMenu() {
  const overlay = document.getElementById('save-load-overlay');
  overlay?.classList.remove('active');
}

function buildMenu() {
  const overlay = document.getElementById('save-load-overlay');
  if (!overlay) return;
  const title = overlay.querySelector('#save-load-title');
  const container = overlay.querySelector('#slots-container');
  title.textContent = mode === 'save' ? 'Save Game' : 'Load Game';
  container.innerHTML = '';

  for (let i = 1; i <= 3; i++) {
    const row = document.createElement('div');
    row.classList.add('slot-row');

    const btn = document.createElement('button');
    btn.textContent =
      mode === 'save' ? `Slot ${i} \u2014 Save` : `Slot ${i} \u2014 Load`;
    const json = localStorage.getItem(`game_save_slot_${i}`);
    const hasData = !!json;
    btn.disabled = mode === 'load' && !hasData;
    btn.addEventListener('click', () => {
      document.dispatchEvent(
        new CustomEvent(mode === 'save' ? 'saveSlot' : 'loadSlot', {
          detail: { slot: i }
        })
      );
      hideMenu();
    });
    row.appendChild(btn);

    let info = '';
    if (hasData) {
      try {
        const data = JSON.parse(json);
        const date = new Date(data.timestamp || Date.now()).toLocaleString();
        const map = data.game?.currentMap || '';
        const items = Array.isArray(data.inventory?.items)
          ? data.inventory.items.length
          : 0;
        info = `${date} — Map: ${map || 'N/A'}, Items: ${items}`;
      } catch {
        info = '';
      }
    } else if (mode === 'load') {
      info = 'Empty';
    }

    const infoEl = document.createElement('div');
    infoEl.classList.add('slot-info');
    infoEl.textContent = info;
    row.appendChild(infoEl);

    container.appendChild(row);
  }
}

export function openSaveMenu() {
  mode = 'save';
  buildMenu();
  document.getElementById('save-load-overlay')?.classList.add('active');
}

export function openLoadMenu() {
  mode = 'load';
  buildMenu();
  document.getElementById('save-load-overlay')?.classList.add('active');
}
