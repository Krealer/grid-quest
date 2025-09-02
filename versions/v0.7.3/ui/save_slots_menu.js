import { showConfirm } from '../scripts/confirmPrompt.js';

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
      if (mode === 'save') {
        if (localStorage.getItem(`game_save_slot_${i}`)) {
          showConfirm(
            'This slot already contains saved progress. Overwrite it?',
            () => {
              document.dispatchEvent(
                new CustomEvent('saveSlot', { detail: { slot: i } })
              );
              buildMenu();
            }
          );
        } else {
          document.dispatchEvent(
            new CustomEvent('saveSlot', { detail: { slot: i } })
          );
          buildMenu();
        }
      } else {
        document.dispatchEvent(
          new CustomEvent('loadSlot', { detail: { slot: i } })
        );
        hideMenu();
      }
    });
    row.appendChild(btn);

    let infoData = null;
    if (hasData) {
      try {
        const data = JSON.parse(json);
        const map = data.mapName || data.game?.currentMap || '';
        const items =
          typeof data.itemCount === 'number'
            ? data.itemCount
            : Array.isArray(data.inventory?.items)
            ? data.inventory.items.length
            : 0;
        const date = new Date(data.timestamp || Date.now()).toLocaleString();
        infoData = { map, items, date };
      } catch {
        infoData = null;
      }
    }

    const infoEl = document.createElement('div');
    infoEl.classList.add('slot-info');
    if (infoData) {
      const mapEl = document.createElement('div');
      mapEl.textContent = `Map: ${infoData.map || 'N/A'}`;
      const itemsEl = document.createElement('div');
      itemsEl.textContent = `Items: ${infoData.items}`;
      const timeEl = document.createElement('div');
      timeEl.textContent = `Saved: ${infoData.date}`;
      infoEl.appendChild(mapEl);
      infoEl.appendChild(itemsEl);
      infoEl.appendChild(timeEl);
    } else {
      infoEl.textContent = 'Slot empty';
    }
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
