import {
  inventory,
  equipItem,
  getEquippedItem,
  getItemDisplayName,
  getItemLevel,
  getItemsByCategory,
  consumeItem
} from './inventory.js';
import { player, getTotalStats, gainXP } from './player.js';
import {
  useHealthPotion,
  useDefensePotion,
  useDefensePotionII,
  useFadedBlade,
  useArcaneSpark,
  useManaGem,
  useStaminaDust,
  useReflectPotion,
  useManaScroll,
  useAegisInvocationScroll,
  useEmberPrayerScroll
} from './item_logic.js';
import { getItemBonuses } from './item_stats.js';
import {
  showItemTooltip,
  hideItemTooltip,
  splitItemId,
  parseEnchantedId
} from './utils.js';
import { canReroll, rerollEnchantment } from './forge.js';
import { enchantments } from './enchantments.js';
import { getItemData } from './item_loader.js';
import { gameState } from './game_state.js';
import { logMessage } from './message_log.js';
import { markItemUsed } from '../info/items.js';
import { loadRelics, getRelicData, getOwnedRelics } from './relic_state.js';

let currentCategory = 'items';
const scrollPositions = {};

function updateCategoryButtons() {
  const btns = document.querySelectorAll('.inventory-categories button');
  btns.forEach((b) => {
    b.classList.toggle('selected', b.dataset.cat === currentCategory);
  });
}

export function initInventoryUI() {
  const list = document.getElementById('inventory-list');
  document.querySelectorAll('.inventory-categories button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (list) {
        scrollPositions[currentCategory] = list.scrollTop;
      }
      currentCategory = btn.dataset.cat;
      updateCategoryButtons();
      updateInventoryUI();
    });
  });
  if (list) {
    list.addEventListener('scroll', () => {
      scrollPositions[currentCategory] = list.scrollTop;
    });
  }
  updateCategoryButtons();
}

export async function updateInventoryUI() {
  const list = document.getElementById('inventory-list');
  if (!list) return;
  const prevScroll = scrollPositions[currentCategory] || 0;
  await loadRelics();
  list.innerHTML = '';
  updateCategoryButtons();
  const statsEl = document.getElementById('player-stats');
  if (statsEl) {
    const stats = getTotalStats();
    const def = stats.defense || 0;
    const tooltip = 'Negative defense increases damage taken by 10% per point.';
    const defHtml =
      def < 0
        ? `<span class="negative" title="${tooltip}">Defense: ${def}</span>`
        : `<span title="${tooltip}">Defense: ${def}</span>`;
    statsEl.innerHTML = `Level: ${player.level}  XP: ${player.xp}/${player.xpToNextLevel}  Attack: ${stats.attack || 0}  ${defHtml}`;
  }
  let cat = currentCategory;
  if (cat === 'items') cat = ['general', 'crafting'];
  const filtered = getItemsByCategory(cat);
  if (filtered.length === 0) {
    const msg = document.createElement('div');
    msg.classList.add('info-empty');
    msg.textContent = 'No items in this category.';
    list.appendChild(msg);
  }
  filtered.forEach((item) => {
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
      if (enchant && enchantments[enchant])
        displayName += ` ${enchantments[enchant].name}`;
    }
    row.innerHTML = `<strong>${displayName}${qty}</strong><div class="desc">${item.description}</div>`;
    if (enchantId) row.classList.add('enchanted');
    const upgradeLevel = getItemLevel(item.id);
    if (upgradeLevel > 0) {
      row.classList.add('gear-upgraded');
    }
    const bonus = getItemBonuses(item.id);
    if (bonus && bonus.slot && getEquippedItem(bonus.slot) === item.id) {
      row.classList.add('equipped-item');
    }
    if (bonus && bonus.slot) {
      const btn = document.createElement('button');
      btn.classList.add('equip-btn');
      btn.textContent =
        getEquippedItem(bonus.slot) === item.id ? 'Unequip' : 'Equip';
      btn.addEventListener('click', (e) => {
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
      rbtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newId = rerollEnchantment(item.id);
        const log = document.getElementById('forge-log');
        if (log && newId)
          log.textContent = `Enchantment rerolled to ${getItemDisplayName(newId)}`;
        updateInventoryUI();
      });
      row.appendChild(rbtn);
    }

    const baseData = getItemData(item.id);
    if (baseData && baseData.category === 'combat') {
      const ubtn = document.createElement('button');
      ubtn.classList.add('equip-btn');
      ubtn.textContent = 'Use';
      ubtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleInventoryItemUse(item.id);
      });
      row.appendChild(ubtn);
    }

    let tooltipText = '';
    if (bonus) {
      const effects = [];
      Object.keys(bonus).forEach((k) => {
        if (k === 'slot') return;
        effects.push(`${k.charAt(0).toUpperCase() + k.slice(1)} +${bonus[k]}`);
      });
      tooltipText = effects.join(', ');
    }
    // baseId was already extracted above; reuse it here to check for set pieces
    if (
      baseId === 'temple_sword' ||
      baseId === 'temple_shell' ||
      baseId === 'temple_ring'
    ) {
      if (tooltipText) tooltipText += '\n';
      tooltipText += 'Temple Set piece';
      if (player.hasTemplePassive) tooltipText += ' (Set active)';
    }
    if (tooltipText) {
      row.addEventListener('mouseenter', () =>
        showItemTooltip(row, tooltipText)
      );
      row.addEventListener('mouseleave', hideItemTooltip);
    }
    list.appendChild(row);
  });

  // Display relics separately
  const relicIds = getOwnedRelics();
  relicIds.forEach((id) => {
    const data = getRelicData(id);
    if (!data) return;
    const row = document.createElement('div');
    row.classList.add('inventory-item', 'relic-item');
    row.innerHTML = `<strong>${data.name}</strong><div class="desc">${data.description || ''}</div>`;
    list.appendChild(row);
  });
  list.scrollTop = prevScroll;
}

function handleInventoryItemUse(id) {
  const data = getItemData(id);
  if (!data) return;
  if (data.useInCombat && !gameState.inCombat) {
    logMessage('Cannot use this item outside combat.');
    return;
  }
  let used = false;
  if (id === 'health_potion') {
    const res = useHealthPotion();
    if (res) {
      player.hp = Math.min(player.maxHp, player.hp + res.heal);
      document.dispatchEvent(
        new CustomEvent('playerHpChanged', {
          detail: { hp: player.hp, maxHp: player.maxHp }
        })
      );
      used = true;
    }
  } else if (id === 'defense_potion_I') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useDefensePotion();
    if (res) used = true;
  } else if (id === 'defense_potion_II') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useDefensePotionII();
    if (res) used = true;
  } else if (id === 'faded_blade') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useFadedBlade();
    if (res) used = true;
  } else if (id === 'arcane_spark') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useArcaneSpark();
    if (res) used = true;
  } else if (id === 'mana_gem') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useManaGem();
    if (res) used = true;
  } else if (id === 'stamina_dust') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useStaminaDust();
    if (res) used = true;
  } else if (id === 'reflect_potion') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useReflectPotion();
    if (res) used = true;
  } else if (id === 'mana_scroll') {
    if (!gameState.inCombat) {
      logMessage('Cannot use this item outside combat.');
      return;
    }
    const res = useManaScroll();
    if (res) used = true;
  } else if (id === 'aegis_invocation_scroll') {
    const res = useAegisInvocationScroll();
    if (res) used = true;
  } else if (id === 'ember_prayer_scroll') {
    const res = useEmberPrayerScroll();
    if (res) used = true;
  } else if (typeof data.use === 'function') {
    if (data.inventoryOnly && gameState.inCombat) {
      logMessage('Cannot use this item in combat.');
      return;
    }
    const res = data.use();
    if (res !== false) {
      consumeItem(id, 1);
      used = true;
    }
  }
  if (used) {
    markItemUsed(id);
    logMessage(`Player used ${data.name}!`);
    updateInventoryUI();
  }
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
document.addEventListener('playerHpChanged', updateInventoryUI);
document.addEventListener('playerXpChanged', updateInventoryUI);
document.addEventListener('playerLevelUp', updateInventoryUI);
document.addEventListener('relicsUpdated', updateInventoryUI);
