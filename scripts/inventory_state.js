import { inventory, equipItem, getEquippedItem } from './inventory.js';
import { player, getTotalStats } from './player.js';
import { useArmorPiece } from './item_logic.js';
import { getItemBonuses } from './item_stats.js';

export function updateInventoryUI() {
  const list = document.getElementById('inventory-list');
  if (!list) return;
  list.innerHTML = '';
  const statsEl = document.getElementById('player-stats');
  if (statsEl) {
    const stats = getTotalStats();
    statsEl.textContent = `Level: ${player.level}  XP: ${player.xp}/${player.xpToNextLevel}  Defense: ${stats.defense || 0}`;
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
    const bonus = getItemBonuses(item.id);
    if (bonus && bonus.slot) {
      const btn = document.createElement('button');
      btn.classList.add('equip-btn');
      btn.textContent = getEquippedItem(bonus.slot) === item.id ? 'Unequip' : 'Equip';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        equipItem(item.id);
        updateInventoryUI();
      });
      row.appendChild(btn);
    }
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
document.addEventListener('playerXpChanged', updateInventoryUI);
document.addEventListener('playerLevelUp', updateInventoryUI);
