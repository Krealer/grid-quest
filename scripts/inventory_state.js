import { inventory } from './inventory.js';

export function updateInventoryUI() {
  const list = document.getElementById('inventory-list');
  if (!list) return;
  list.innerHTML = '';
  inventory.forEach(item => {
    const row = document.createElement('div');
    row.classList.add('inventory-item');
    row.innerHTML = `<strong>${item.name}</strong><div class="desc">${item.description}</div>`;
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
