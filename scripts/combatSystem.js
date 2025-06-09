
import { getSkill } from './skills.js';
import { triggerDeath, addTempDefense } from './player.js';
import { applyDamage } from './logic.js';
import { addItem, getItemsByType } from './inventory.js';
import { loadItems, getItemData } from './item_loader.js';
import { useDefensePotion } from './item_logic.js';
import { updateInventoryUI } from './inventory_state.js';
import { showDialogue } from './dialogueSystem.js';
import { setupTabs, updateStatusUI, renderSkillList } from './combat_ui.js';
import { tickStatuses, initStatuses, applyStatus } from './statusManager.js';
import { initEnemyState } from './enemy.js';

let overlay = null;

function updateHpBar(bar, current, max) {
  bar.style.width = `${(current / max) * 100}%`;
}

/**
 * Starts a basic turn-based combat encounter.
 * @param {{name:string,hp:number}} enemy The enemy to fight.
 * @param {{learnedSkills:string[]}} player Player state containing skills.
 */
export async function startCombat(enemy, player) {
  const gridEl = document.getElementById('game-grid');
  if (!gridEl) return;

  gridEl.classList.add('blurred');

  overlay = document.createElement('div');
  overlay.id = 'battle-overlay';
  overlay.classList.add('battle-transition');
  overlay.innerHTML = `
    <div class="combat-screen">
      <div class="combatants">
        <div class="combatant player">
          <div class="name">Hero</div>
          <div class="hp-bar"><div class="hp"></div></div>
          <div class="statuses player-statuses"></div>
        </div>
        <div class="combatant enemy intro-anim">
          <div class="portrait">${enemy.portrait || '👾'}</div>
          <div class="name">${enemy.name}</div>
          <div class="desc">${enemy.description || ''}</div>
          <div class="hp-bar"><div class="hp"></div></div>
          <div class="statuses enemy-statuses"></div>
        </div>
      </div>
      <div class="intro-text">${
        enemy.intro || 'A shadowy beast snarls and prepares to strike!'
      }</div>
      <div class="actions hidden">
        <div class="action-tabs">
          <button class="skills-tab selected">Skills</button>
          <button class="items-tab">Items</button>
        </div>
        <div class="tab-panels">
          <div class="skill-buttons tab-panel"></div>
          <div class="item-buttons tab-panel hidden"></div>
        </div>
      </div>
      <div class="log hidden"></div>
    </div>`;

  document.body.appendChild(overlay);
  document.dispatchEvent(new CustomEvent('combatStarted'));
  requestAnimationFrame(() => overlay.classList.add('active'));

  const playerBar = overlay.querySelector('.player .hp');
  const enemyBar = overlay.querySelector('.enemy .hp');

  const playerMax = player.maxHp ?? 100;
  const enemyMax = enemy.hp || 50;
  let playerHp = player.hp ?? playerMax;
  let enemyHp = enemyMax;

  // initialize status tracking and temp stats
  initStatuses(player);
  initStatuses(enemy);
  initEnemyState(enemy);
  player.tempDefense = 0;
  player.tempAttack = 0;
  enemy.tempDefense = 0;
  enemy.tempAttack = 0;

  updateHpBar(playerBar, playerHp, playerMax);
  updateHpBar(enemyBar, enemyHp, enemyMax);

  const actionsEl = overlay.querySelector('.actions');
  const skillContainer = overlay.querySelector('.skill-buttons');
  const itemContainer = overlay.querySelector('.item-buttons');
  const logEl = overlay.querySelector('.log');

  await loadItems();

  // reveal UI after intro animation
  setTimeout(() => {
    actionsEl.classList.remove('hidden');
    logEl.classList.remove('hidden');
  }, 800);

  function log(msg) {
    const entry = document.createElement('div');
    entry.textContent = msg;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
    console.log(msg);
  }

  let guardActive = false;
  let shieldBlock = false;
  let healUsed = false;
  let playerTurn = true;

  function damageEnemy(dmg) {
    enemyHp = Math.max(0, enemyHp - dmg);
    enemy.hp = enemyHp;
    updateHpBar(enemyBar, enemyHp, enemyMax);
    enemyBar.classList.add('damage');
    setTimeout(() => enemyBar.classList.remove('damage'), 300);
  }

  function healPlayer(amount) {
    playerHp = Math.min(playerMax, playerHp + amount);
    player.hp = playerHp;
    updateHpBar(playerBar, playerHp, playerMax);
    playerBar.classList.add('damage');
    setTimeout(() => playerBar.classList.remove('damage'), 300);
  }

  function activateGuard() {
    guardActive = true;
  }

  function activateShieldBlock() {
    shieldBlock = true;
  }

  function isHealUsed() {
    return healUsed;
  }

  function setHealUsed() {
    healUsed = true;
  }

  async function giveDrop() {
    if (!enemy.drop || !enemy.drop.item) return;
    await loadItems();
    const data = getItemData(enemy.drop.item);
    if (!data) return;
    const success = addItem({
      ...data,
      id: enemy.drop.item,
      quantity: enemy.drop.quantity || 1,
    });
    updateInventoryUI();
    if (success) {
      showDialogue(`You obtained ${data.name}!`);
    } else {
      showDialogue('Inventory full for this item');
    }
  }

  function updateItemsUI() {
    itemContainer.innerHTML = '';
    const items = getItemsByType('combat');
    if (items.length === 0) {
      const msg = document.createElement('div');
      msg.textContent = 'No usable items';
      itemContainer.appendChild(msg);
      return;
    }
    items.forEach(it => {
      const data = getItemData(it.id);
      const btn = document.createElement('button');
      const qty = it.quantity > 1 ? ` x${it.quantity}` : '';
      btn.textContent = `${data.name}${qty}`;
      btn.addEventListener('click', () => handleItemUse(it.id));
      itemContainer.appendChild(btn);
    });
  }

  const skillList = (player.learnedSkills || [])
    .map(id => getSkill(id))
    .filter(Boolean);

  renderSkillList(skillContainer, skillList, handleAction);

  updateItemsUI();
  document.addEventListener('inventoryUpdated', updateItemsUI);
  setupTabs(overlay);
  updateStatusUI(overlay, player, enemy);

  async function handleAction(skill) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    const result = skill.effect({
      damageEnemy,
      healPlayer,
      activateGuard,
      activateShieldBlock,
      log,
      isHealUsed,
      setHealUsed,
      applyStatus,
      player,
      enemy,
    });
    if (result === false) return; // invalid action
    if (enemyHp <= 0) {
      log(`${enemy.name} was defeated!`);
      await giveDrop();
      endCombat();
      return;
    }
    tickStatuses(player);
    tickStatuses(enemy);
    playerHp = player.hp;
    enemyHp = enemy.hp;
    updateHpBar(playerBar, playerHp, playerMax);
    updateHpBar(enemyBar, enemyHp, enemyMax);
    updateStatusUI(overlay, player, enemy);
    playerTurn = false;
    setTimeout(enemyTurn, 300);
  }

  function handleItemUse(id) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    let used = false;
    if (id === 'defense_potion_I') {
      const res = useDefensePotion();
      if (res) {
        addTempDefense(res.defense);
        log('Defense increased by 1 for this fight!');
        used = true;
      } else {
        log('No potion available.');
      }
    }
    if (used) {
      updateItemsUI();
      tickStatuses(player);
      tickStatuses(enemy);
      playerHp = player.hp;
      enemyHp = enemy.hp;
      updateHpBar(playerBar, playerHp, playerMax);
      updateHpBar(enemyBar, enemyHp, enemyMax);
      updateStatusUI(overlay, player, enemy);
      playerTurn = false;
      setTimeout(enemyTurn, 300);
    }
  }

  function endCombat() {
    log('Combat ended');
    if (player) {
      player.hp = playerHp;
    }
    if (playerHp <= 0) {
      triggerDeath();
    }
    gridEl.classList.remove('blurred');
    overlay.remove();
    overlay = null;
    document.removeEventListener('inventoryUpdated', updateItemsUI);
    document.dispatchEvent(
      new CustomEvent('combatEnded', { detail: { playerHp, enemyHp, enemy } })
    );
    if (enemyHp <= 0 && enemy.onDefeatMessage) {
      showDialogue(enemy.onDefeatMessage);
    }
  }

  function enemyTurn() {
    if (enemyHp <= 0) return;
    let dmg = 8;
    if (shieldBlock) {
      dmg = 0;
      shieldBlock = false;
    } else if (guardActive) {
      dmg = Math.max(0, dmg - 5);
      guardActive = false;
    }
    const tempTarget = {
      hp: playerHp,
      stats: { defense: (player.stats?.defense || 0) + player.tempDefense },
    };
    const applied = applyDamage(tempTarget, dmg);
    playerHp = tempTarget.hp;
    player.hp = playerHp;
    log(`${enemy.name} attacks for ${applied} damage!`);
    updateHpBar(playerBar, playerHp, playerMax);
    playerBar.classList.add('damage');
    setTimeout(() => playerBar.classList.remove('damage'), 300);
    if (playerHp <= 0) {
      log('Player was defeated!');
      endCombat();
      return;
    }
    tickStatuses(player);
    tickStatuses(enemy);
    playerHp = player.hp;
    enemyHp = enemy.hp;
    updateHpBar(playerBar, playerHp, playerMax);
    updateHpBar(enemyBar, enemyHp, enemyMax);
    updateStatusUI(overlay, player, enemy);
    if (playerHp <= 0) {
      log('Player was defeated!');
      endCombat();
      return;
    }
    if (enemyHp <= 0) {
      log(`${enemy.name} was defeated!`);
      giveDrop();
      endCombat();
      return;
    }
    playerTurn = true;
  }
}
