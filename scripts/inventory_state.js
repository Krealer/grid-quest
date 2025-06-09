import { inventory } from './inventory.js';
import { player } from './player.js';
import { useArmorPiece } from './item_logic.js';

export function updateInventoryUI() {
  const list = document.getElementById('inventory-list');
  if (!list) return;
  list.innerHTML = '';
  const statsEl = document.getElementById('player-stats');
  if (statsEl) {
    statsEl.textContent = `Defense: ${player.stats?.defense || 0}`;
  }
  inventory.forEach(item => {
    const row = document.createElement('div');
    row.classList.add('inventory-item');
    row.dataset.id = item.id;
    const qty = item.quantity > 1 ? ` x${item.quantity}` : '';
    row.innerHTML = `<strong>${item.name}${qty}</strong><div class="desc">${item.description}</div>`;
    row.addEventListener('click', () => {
      if (item.id === 'armor_piece') {
        useArmorPiece();
      }
    });
    list.appendChild(row);
  });
}

export function toggleInventoryView() {
  const overlay = document.getElementById('inventory-overlay');
  if (!overlay) return;
  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    updateInventoryUI();
    overlay.classList.add('active');
  }
}

// Keep UI in sync when inventory changes
document.addEventListener('inventoryUpdated', updateInventoryUI);
document.addEventListener('playerDefenseChanged', updateInventoryUI);
