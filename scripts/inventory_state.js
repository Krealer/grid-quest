import {
  inventory,
  equipItem,
  getEquippedItem,
  getItemDisplayName,
  getItemLevel,
} from './inventory.js';
import { player, getTotalStats } from './player.js';
import { useArmorPiece } from './item_logic.js';
import { getItemBonuses } from './item_stats.js';
import { showItemTooltip, hideItemTooltip, splitItemId, parseEnchantedId } from './utils.js';
import { canReroll, rerollEnchantment } from './forge.js';
import { enchantments } from './enchantments.js';
import { getItemData } from './item_loader.js';

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
    const { baseId, level, enchant } = splitItemId(item.id);
    const { enchant: enchantId } = parseEnchantedId(item.id);
    let displayName = item.name;
    if (!displayName) {
      const baseData = getItemData(baseId);
      displayName = baseData?.name || baseId;
      if (level > 0) displayName += ` +${level}`;
      if (enchant && enchantments[enchant]) displayName += ` ${enchantments[enchant].name}`;
    }
    row.innerHTML = `<strong>${displayName}${qty}</strong><div class="desc">${item.description}</div>`;
    if (enchantId) row.classList.add('enchanted');
    const level = getItemLevel(item.id);
    if (level > 0) {
      row.classList.add('gear-upgraded');
    }
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
    if (enchantId && bonus && bonus.slot) {
      const rbtn = document.createElement('button');
      rbtn.classList.add('reroll-btn');
      rbtn.textContent = 'Reroll';
      rbtn.disabled = !canReroll(item.id);
      rbtn.addEventListener('click', e => {
        e.stopPropagation();
        const newId = rerollEnchantment(item.id);
        const log = document.getElementById('forge-log');
        if (log && newId) log.textContent = `Enchantment rerolled to ${getItemDisplayName(newId)}`;
        updateInventoryUI();
      });
      row.appendChild(rbtn);
    }

    let tooltipText = '';
    if (bonus) {
      const effects = [];
      Object.keys(bonus).forEach(k => {
        if (k === 'slot') return;
        effects.push(`${k.charAt(0).toUpperCase() + k.slice(1)} +${bonus[k]}`);
      });
      tooltipText = effects.join(', ');
    }
    if (tooltipText) {
      row.addEventListener('mouseenter', () => showItemTooltip(row, tooltipText));
      row.addEventListener('mouseleave', hideItemTooltip);
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
