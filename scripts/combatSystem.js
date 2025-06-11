import { getSkill } from './skills.js';
import { getEnemySkill } from './enemy_skills.js';
import {
  respawn,
  addTempDefense,
  increaseMaxHp,
  gainXP,
  getTotalStats
} from './player.js';
import { getClassBonuses } from './class_state.js';
import { getPassive } from './passive_skills.js';
import { applyDamage } from './logic.js';
import {
  addItem,
  getItemsByType,
  addItemToInventory,
  removeHealthBonusItem
} from './inventory.js';
import { loadItems, getItemData } from './item_loader.js';
import {
  useDefensePotion,
  useDefensePotionII,
  useFadedBlade,
  useArcaneSpark
} from './item_logic.js';
import { updateInventoryUI } from './inventory_state.js';
import { showDialogue } from './dialogueSystem.js';
import { gameState } from './game_state.js';
import { discover, discoverSkill } from './player_memory.js';
import { advanceBossPhase, resetBossPhase } from './boss_state.js';
import { finalFlags, setPhase, setBossDefeated } from './memory_flags.js';
import { recordEnding } from './ending_manager.js';
import { echoAbsoluteVictory, echoAbsoluteDefeat } from './dialogue_state.js';
import { spawnNpc } from './map.js';
import { isElite, isBoss } from './enemy_logic.js';
import { getEnemyDrops } from './loot_table.js';
import {
  setupTabs,
  updateStatusUI,
  renderSkillList,
  setSkillDisabledState,
  initLogPanel,
  showVictoryMessage,
  showXpGain,
  showLevelUp
} from './combat_ui.js';
import {
  initStatuses,
  removeNegativeStatus as removeNegativeStatusEffect,
  hasStatus,
  clearStatuses
} from './statusManager.js';
import {
  applyEffect as applyStatusEffect,
  removeStatus as removeStatusEffect,
  tickStatusEffects
} from './status_effect.js';
import { getStatusEffect } from './status_effects.js';
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

  gameState.inCombat = true;
  gridEl.classList.add('no-interact');
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
          <div class="statuses status-effects player-statuses"></div>
        </div>
        <div class="combatant enemy intro-anim">
          <div class="portrait">${enemy.portrait || '👾'}</div>
          <div class="name">${enemy.name}</div>
          <div class="desc">${enemy.description || ''}</div>
          <div class="hp-bar"><div class="hp"></div></div>
          <div class="statuses status-effects enemy-statuses"></div>
        </div>
      </div>
      <div class="intro-text">${
        enemy.intro || 'A shadowy beast snarls and prepares to strike!'
      }</div>
      <div class="actions hidden">
        <div class="action-tabs">
          <button class="offensive-tab selected">Offensive</button>
          <button class="defensive-tab">Defensive</button>
          <button class="items-tab">Items</button>
        </div>
        <div class="tab-panels">
          <div class="offensive-skill-buttons tab-panel"></div>
          <div class="defensive-skill-buttons tab-panel hidden"></div>
          <div class="item-buttons tab-panel hidden"></div>
        </div>
      </div>
      <div class="log hidden"></div>
    </div>`;

  document.body.appendChild(overlay);
  resetBossPhase(enemy.id);
  if (enemy.id === 'echo_absolute') setPhase(1);
  document.dispatchEvent(new CustomEvent('combatStarted'));
  requestAnimationFrame(() => overlay.classList.add('active'));

  const playerBar = overlay.querySelector('.player .hp');
  const enemyBar = overlay.querySelector('.enemy .hp');

  const statsBonus = getTotalStats();
  const playerMax = (player.maxHp ?? 100) + (statsBonus.maxHp || 0);
  const enemyMax = enemy.hp || 50;
  enemy.maxHp = enemyMax;
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
  enemy.skillIndex = 0;

  updateHpBar(playerBar, playerHp, playerMax);
  updateHpBar(enemyBar, enemyHp, enemyMax);

  const actionsEl = overlay.querySelector('.actions');
  const offensiveContainer = overlay.querySelector('.offensive-skill-buttons');
  const defensiveContainer = overlay.querySelector('.defensive-skill-buttons');
  const itemContainer = overlay.querySelector('.item-buttons');
  const logEl = overlay.querySelector('.log');

  const log = initLogPanel(overlay);

  await loadItems();

  // reveal UI after intro animation
  setTimeout(() => {
    actionsEl.classList.remove('hidden');
    logEl.classList.remove('hidden');
  }, 800);

  let guardActive = false;
  let shieldBlock = false;
  let healUsed = false;
  let sparkUsed = false;
  let playerTurn = true;

  function damagePlayer(dmg) {
    let amount = dmg;
    if (shieldBlock) {
      amount = 0;
      shieldBlock = false;
    } else if (guardActive) {
      amount = Math.max(0, amount - 5);
      guardActive = false;
    }
    const base = getTotalStats();
    const tempTarget = {
      hp: playerHp,
      stats: { defense: (base.defense || 0) + player.tempDefense },
      damageTakenMod: player.damageTakenMod,
      absorb: player.absorb,
      hasResolve: player.hasResolve
    };
    const applied = applyDamage(tempTarget, amount);
    playerHp = tempTarget.hp;
    player.hp = playerHp;
    player.absorb = tempTarget.absorb;
    updateHpBar(playerBar, playerHp, playerMax);
    playerBar.classList.add('damage');
    setTimeout(() => playerBar.classList.remove('damage'), 300);
    log(`Player takes ${applied} damage`);
    return applied;
  }

  function damageEnemy(baseDmg) {
    const stats = getTotalStats();
    let dmg = baseDmg + (stats.attack || 0) + (player.tempAttack || 0);
    if (typeof player.damageModifier === 'number') {
      dmg *= player.damageModifier;
    }
    if (typeof player.bonusDamage === 'number') {
      dmg += player.bonusDamage;
      player.bonusDamage = 0;
    }
    const tempTarget = {
      hp: enemyHp,
      stats: { defense: (enemy.stats?.defense || 0) + enemy.tempDefense },
      damageTakenMod: enemy.damageTakenMod,
      absorb: enemy.absorb,
      hasResolve: enemy.hasResolve
    };
    const applied = applyDamage(tempTarget, dmg);
    enemyHp = tempTarget.hp;
    enemy.hp = enemyHp;
    enemy.absorb = tempTarget.absorb;
    updateHpBar(enemyBar, enemyHp, enemyMax);
    enemyBar.classList.add('damage');
    setTimeout(() => enemyBar.classList.remove('damage'), 300);
    log(`${enemy.name} takes ${applied} damage`);
  }

  function healPlayer(amount) {
    playerHp = Math.min(playerMax, playerHp + amount);
    player.hp = playerHp;
    updateHpBar(playerBar, playerHp, playerMax);
    playerBar.classList.add('damage');
    setTimeout(() => playerBar.classList.remove('damage'), 300);
    log(`Player heals ${amount} HP`);
  }

  function applyStatusLogged(target, id, duration) {
    applyStatusEffect(target, id, duration);
    const name = getStatusEffect(id)?.name || id;
    const who = target === player ? 'Player' : enemy.name;
    log(`${who} gains ${name}`);
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
  }

  function removeStatusLogged(target, id) {
    removeStatusEffect(target, id);
    const name = getStatusEffect(id)?.name || id;
    const who = target === player ? 'Player' : enemy.name;
    log(`${name} removed from ${who}`);
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
  }

  function removeNegativeStatusLogged(target, ids) {
    const removed = removeNegativeStatusEffect(target, ids);
    removed.forEach((r) => {
      const name = getStatusEffect(r)?.name || r;
      const who = target === player ? 'Player' : enemy.name;
      log(`${name} removed from ${who}`);
    });
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
    return removed;
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

  async function giveDrops() {
    const list = await getEnemyDrops(enemy.id);
    if (!list.length) return;
    await loadItems();
    for (const drop of list) {
      const data = getItemData(drop.item);
      if (!data) continue;
      const success = addItemToInventory({
        ...data,
        id: drop.item,
        quantity: drop.quantity || 1
      });
      updateInventoryUI();
      if (success) {
        showDialogue(`You obtained ${data.name}!`);
      } else {
        showDialogue('Inventory full for this item');
      }
    }
    if (typeof enemy.xp === 'number') {
      const leveled = gainXP(enemy.xp);
      showXpGain(enemy.xp);
      if (leveled) {
        showLevelUp(player.level);
      }
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
    items.forEach((it) => {
      const data = getItemData(it.id);
      const btn = document.createElement('button');
      const qty = it.quantity > 1 ? ` x${it.quantity}` : '';
      btn.textContent = `${data.name}${qty}`;
      btn.addEventListener('click', () => handleItemUse(it.id));
      itemContainer.appendChild(btn);
    });
  }

  const allSkills = (player.learnedSkills || [])
    .map((id) => getSkill(id))
    .filter(Boolean);

  const skillLookup = {};
  allSkills.forEach((s) => {
    skillLookup[s.id] = s;
  });

  const offensiveSkills = allSkills.filter((s) => s.category === 'offensive');
  const defensiveSkills = allSkills.filter((s) => s.category === 'defensive');

  const offButtons = renderSkillList(
    offensiveContainer,
    offensiveSkills,
    handleAction
  );
  const defButtons = renderSkillList(
    defensiveContainer,
    defensiveSkills,
    handleAction
  );
  const skillButtons = { ...offButtons, ...defButtons };

  updateItemsUI();
  document.addEventListener('inventoryUpdated', updateItemsUI);
  setupTabs(overlay);
  updateStatusUI(overlay, player, enemy);
  updateSkillDisableState();

  function updateSkillDisableState() {
    const silenced =
      hasStatus(player, 'silence') || hasStatus(player, 'silenced');
    setSkillDisabledState(skillButtons, skillLookup, silenced);
  }

  async function handleAction(skill) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    if (hasStatus(player, 'paralyzed') && Math.random() < 0.5) {
      log('Paralyzed! You cannot act.');
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = false;
      setTimeout(enemyTurn, 300);
      return;
    }
    if (hasStatus(player, 'unstable') && Math.random() < 0.25) {
      log('Unstable! Your action falters.');
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = false;
      setTimeout(enemyTurn, 300);
      return;
    }
    const silenced =
      hasStatus(player, 'silenced') || hasStatus(player, 'silence');
    if (silenced && skill.category === 'offensive') {
      log('You are silenced and cannot use offensive skills.');
      return;
    }
    const icon = skill.icon ? `${skill.icon} ` : '';
    log(`Player uses ${icon}${skill.name}`);
    discoverSkill(skill.id);
    const result = skill.effect({
      damageEnemy,
      healPlayer,
      activateGuard,
      activateShieldBlock,
      log,
      isHealUsed,
      setHealUsed,
      applyStatus: applyStatusLogged,
      removeStatus: removeStatusLogged,
      removeNegativeStatus: removeNegativeStatusLogged,
      player,
      enemy
    });
    if (result === false) return; // invalid action
    handlePhaseTriggers();
    if (enemyHp <= 0) {
      log(`${enemy.name} was defeated!`);
      discover('enemies', enemy.id);
      await giveDrops();
      if (enemy.id === 'echo_absolute') {
        recordEnding('victory', 'echo absolute');
        echoAbsoluteVictory();
        setBossDefeated();
        spawnNpc(10, 10, 'krealer');
      }
      showVictoryMessage();
      setTimeout(endCombat, 800);
      return;
    }
    tickStatusEffects(player, log);
    tickStatusEffects(enemy, log);
    playerHp = player.hp;
    enemyHp = enemy.hp;
    handlePhaseTriggers();
    updateHpBar(playerBar, playerHp, playerMax);
    updateHpBar(enemyBar, enemyHp, enemyMax);
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
    if (playerHp <= 0) {
      log('Player was defeated!');
      endCombat();
      return;
    }
    playerTurn = false;
    setTimeout(enemyTurn, 300);
  }

  function handleItemUse(id) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    if (hasStatus(player, 'cursed')) {
      log('A curse prevents you from using items!');
      return;
    }
    let used = false;
    const data = getItemData(id);
    if (data) log(`Player uses ${data.name}`);
    if (id === 'defense_potion_I') {
      const res = useDefensePotion();
      if (res) {
        let amount = res.defense;
        if (player.passives && player.passives.includes('potionMaster')) {
          const p = getPassive('potionMaster');
          if (p && p.itemHealBonus) {
            // if potion mastery defined bonus to defense potions, reuse field
            amount += p.itemHealBonus;
          }
        }
        const classBonus = getClassBonuses();
        if (classBonus.itemHealBonus) {
          amount += classBonus.itemHealBonus;
        }
        addTempDefense(amount);
        log(`Defense increased by ${amount} for this fight!`);
        used = true;
      } else {
        log('No potion available.');
      }
    }
    if (id === 'defense_potion_II') {
      const res = useDefensePotionII();
      if (res) {
        let amount = res.defense;
        if (player.passives && player.passives.includes('potionMaster')) {
          const p = getPassive('potionMaster');
          if (p && p.itemHealBonus) {
            amount += p.itemHealBonus;
          }
        }
        const classBonus = getClassBonuses();
        if (classBonus.itemHealBonus) {
          amount += classBonus.itemHealBonus;
        }
        addTempDefense(amount);
        log(`Defense increased by ${amount} for this fight!`);
        used = true;
      } else {
        log('No potion available.');
      }
    }
    if (id === 'faded_blade') {
      const res = useFadedBlade();
      if (res) {
        log(`Attack increased by ${res.attack} for this fight!`);
        used = true;
      } else {
        log('No blade available.');
      }
    }
    if (id === 'arcane_spark') {
      if (sparkUsed) {
        log('The spark has already been unleashed this battle.');
      } else {
        const res = useArcaneSpark();
        if (res) {
          damageEnemy(res.damage);
          log(`Arcane energies erupt for ${res.damage} damage!`);
          sparkUsed = true;
          used = true;
        } else {
          log('No spark available.');
        }
      }
    }
    if (used) {
      updateItemsUI();
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerHp = player.hp;
      enemyHp = enemy.hp;
      updateHpBar(playerBar, playerHp, playerMax);
      updateHpBar(enemyBar, enemyHp, enemyMax);
      updateStatusUI(overlay, player, enemy);
      updateSkillDisableState();
      playerTurn = false;
      setTimeout(enemyTurn, 300);
    }
  }

  function endCombat() {
    log('Combat ended');
    if (player) {
      player.hp = playerHp;
    }
    gameState.inCombat = false;
    gridEl.classList.remove('blurred');
    gridEl.classList.remove('no-interact');
    overlay.remove();
    overlay = null;
    document.removeEventListener('inventoryUpdated', updateItemsUI);
    document.dispatchEvent(
      new CustomEvent('combatEnded', { detail: { playerHp, enemyHp, enemy } })
    );
    if (enemyHp <= 0 && enemy.onDefeatMessage) {
      showDialogue(enemy.onDefeatMessage);
    }
    if (playerHp <= 0) {
      defeat();
    }
  }

  async function defeat() {
    log('Defeated...');
    showDialogue('Defeated...');
    if (removeHealthBonusItem()) {
      increaseMaxHp(-1);
      gameState.maxHpBonus = Math.max(0, (gameState.maxHpBonus || 0) - 1);
    }
    clearStatuses(player);
    await respawn();
    if (enemy.id === 'echo_absolute') {
      recordEnding('defeat', 'echo absolute');
      echoAbsoluteDefeat();
    }
  }

  function handlePhaseTriggers() {
    if (enemy.id === 'echo_absolute') {
      const pct = enemy.hp / enemy.maxHp;
      if (finalFlags.phase === 1 && pct <= 0.7) {
        enemy.skills.push('memorySurge');
        setPhase(2);
        showDialogue('Memories ignite around the Absolute!');
      } else if (finalFlags.phase === 2 && pct <= 0.3) {
        enemy.skills.push('relicGuard');
        setPhase(3);
        showDialogue('Relics resonate with new power!');
      }
    } else {
      advanceBossPhase(enemy);
    }
  }

  function enemyTurn() {
    if (enemyHp <= 0) return;
    if (hasStatus(enemy, 'paralyzed') && Math.random() < 0.5) {
      log(`${enemy.name} is paralyzed and cannot act!`);
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = true;
      return;
    }
    if (hasStatus(enemy, 'unstable') && Math.random() < 0.25) {
      log(`${enemy.name} staggers in instability!`);
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = true;
      return;
    }
    const enemySilenced =
      hasStatus(enemy, 'silenced') || hasStatus(enemy, 'silence');
    let list = (enemy.skills || ['strike'])
      .map((id) => getEnemySkill(id))
      .filter(Boolean);
    if (enemySilenced) {
      list = list.filter((s) => s.category !== 'offensive');
    }

    const statusSkills = list.filter(
      (s) =>
        Array.isArray(s.applies) &&
        s.applies.some((st) => !hasStatus(player, st))
    );
    const damageSkills = list.filter(
      (s) => s.aiType === 'damage' || !s.applies
    );

    let skill = null;
    const playerVulnerable = hasStatus(player, 'vulnerable');
    const behavior = enemy.behavior || 'balanced';
    const special = isElite(enemy) || isBoss(enemy);

    if (enemy.cycleSkills && list.length) {
      const idx = enemy.skillIndex || 0;
      skill = list[idx % list.length];
      enemy.skillIndex = (idx + 1) % list.length;
    } else {
      if (special && list.length >= 2) {
        skill = list[Math.floor(Math.random() * list.length)];
      } else if (playerVulnerable && statusSkills.length) {
        // exploit vulnerability with status attacks
        skill = statusSkills[Math.floor(Math.random() * statusSkills.length)];
      } else if (behavior === 'aggressive' && damageSkills.length) {
        skill = damageSkills[Math.floor(Math.random() * damageSkills.length)];
      } else if (behavior === 'cautious' && statusSkills.length) {
        skill = statusSkills[Math.floor(Math.random() * statusSkills.length)];
      } else if (damageSkills.length) {
        skill = damageSkills[Math.floor(Math.random() * damageSkills.length)];
      }

      if (!skill) {
        if (list.length > 0) {
          skill = list[Math.floor(Math.random() * list.length)];
        } else if (!enemySilenced) {
          skill = getEnemySkill('strike');
        } else {
          log(`${enemy.name} is silenced and cannot act!`);
          tickStatusEffects(player, log);
          tickStatusEffects(enemy, log);
          playerTurn = true;
          return;
        }
      }
    }

    if (skill) {
      const icon = skill.icon ? `${skill.icon} ` : '';
      log(`${enemy.name} uses ${icon}${skill.name}`);
      discoverSkill(skill.id);
      skill.effect({
        player,
        enemy,
        damagePlayer,
        applyStatus: applyStatusLogged,
        removeStatus: removeStatusLogged,
        removeNegativeStatus: removeNegativeStatusLogged,
        log
      });
    }
    if (playerHp <= 0) {
      log('Player was defeated!');
      endCombat();
      return;
    }
    tickStatusEffects(player, log);
    tickStatusEffects(enemy, log);
    playerHp = player.hp;
    enemyHp = enemy.hp;
    updateHpBar(playerBar, playerHp, playerMax);
    updateHpBar(enemyBar, enemyHp, enemyMax);
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
    if (playerHp <= 0) {
      log('Player was defeated!');
      if (enemy.id === 'echo_absolute') {
        recordEnding('defeat', 'echo absolute');
        echoAbsoluteDefeat();
      }
      endCombat();
      return;
    }
    if (enemyHp <= 0) {
      log(`${enemy.name} was defeated!`);
      discover('enemies', enemy.id);
      giveDrops();
      if (enemy.id === 'echo_absolute') {
        recordEnding('victory', 'echo absolute');
        echoAbsoluteVictory();
        setBossDefeated();
        spawnNpc(10, 10, 'krealer');
      }
      showVictoryMessage();
      setTimeout(endCombat, 800);
      return;
    }
    playerTurn = true;
  }
}
