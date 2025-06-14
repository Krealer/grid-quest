import { getSkill } from './skills.js';
import { getEnemySkill } from './enemy_skills.js';
import { respawn, gainXP, getTotalStats } from './player.js';
import { getClassBonuses } from './class_state.js';
import { getPassive } from './passive_skills.js';
import { applyDamage } from './logic.js';
import {
  addItem,
  getItemsByCategory,
  addItemToInventory
} from './inventory.js';
import { loadItems, getItemData } from './item_loader.js';
import {
  useDefensePotion,
  useDefensePotionII,
  useFadedBlade,
  useArcaneSpark,
  useHealthPotion,
  useManaGem,
  useStaminaDust,
  useReflectPotion,
  useManaScroll
} from './item_logic.js';
import { logMessage } from './message_log.js';
import { updateInventoryUI } from './inventory_ui.js';
import { showDialogue } from './dialogue_system.js';
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
  renderTurnQueue,
  renderCombatants,
  setSkillDisabledState,
  initLogPanel,
  showVictoryMessage,
  showXpGain,
  showLevelUp,
  highlightActing
} from './combat_ui.js';
import { chooseBestSkill } from './ai_logic.js';
import {
  initSkillPreview,
  showSkillPreview,
  hideSkillPreview,
  initPortraitLayout
} from './combat_renderer.js';
import { clearActiveTile } from './grid_renderer.js';
import {
  initStatuses,
  removeNegativeStatus as removeNegativeStatusEffect,
  hasStatus,
  clearStatuses
} from './status_manager.js';
import {
  applyEffect as applyStatusEffect,
  removeStatus as removeStatusEffect,
  tickStatusEffects
} from './status_effect.js';
import { getStatusEffect } from './status_effects.js';
import { initEnemyState } from './enemy.js';
import { combatState, initCombatState } from './combat_state.js';
import { initTurnOrder, nextTurn } from './combat_engine.js';
import { updateHpBar } from './combat_ui_helpers.js';
import { t } from './i18n.js';

let overlay = null;

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
      <div class="turn-queue spd-log spd-bar speed-log"></div>
      <div class="combatants actor-grid">
        <div class="player-team actor-column"></div>
        <div id="combat-log" class="log combat-log hidden"></div>
        <div class="enemy-team actor-column"></div>
      </div>
      <div class="intro-text">${
        enemy.intro || 'A shadowy beast snarls and prepares to strike!'
      }</div>
      <div class="actions hidden">
        <button id="auto-battle-toggle" class="auto-battle-btn" data-i18n="combat.auto.toggle">${t('combat.auto.toggle')}</button>
        <div class="action-tabs action-types">
          <button class="offensive-tab combat-skill-category action-button selected" data-i18n="combat.category.offensive">${t('combat.category.offensive')}</button>
          <button class="defensive-tab combat-skill-category action-button" data-i18n="combat.category.defensive">${t('combat.category.defensive')}</button>
          <button class="items-tab combat-skill-category action-button" data-i18n="combat.category.items">${t('combat.category.items')}</button>
        </div>
        <div class="tab-panels skill-panel">
          <div class="offensive-skill-buttons tab-panel"></div>
          <div class="defensive-skill-buttons tab-panel hidden"></div>
          <div class="item-buttons tab-panel hidden"></div>
        </div>
      </div>
      <div id="skill-preview" class="skill-preview hidden"></div>
    </div>`;

  document.body.appendChild(overlay);
  initPortraitLayout(overlay);
  renderCombatants(
    overlay.querySelector('.combatants'),
    Array.isArray(player) ? player : [player],
    Array.isArray(enemy) ? enemy : [enemy]
  );
  // Re-insert the combat log panel that renderCombatants() removed
  const combatantsEl = overlay.querySelector('.combatants');
  if (combatantsEl) {
    const logPanel = document.createElement('div');
    logPanel.id = 'combat-log';
    logPanel.className = 'log combat-log hidden';
    const enemyTeam = combatantsEl.querySelector('.enemy-team');
    combatantsEl.insertBefore(logPanel, enemyTeam);
  }
  resetBossPhase(enemy.id);
  if (enemy.id === 'echo_absolute') setPhase(1);
  document.dispatchEvent(new CustomEvent('combatStarted'));
  requestAnimationFrame(() => overlay.classList.add('active'));

  const playerBar = overlay.querySelector(
    '.player-team .combatant[data-index="0"] .hp'
  );
  const enemyBar = overlay.querySelector(
    '.enemy-team .combatant[data-index="0"] .hp'
  );

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
  enemy.turnCount = 0;

  updateHpBar(playerBar, playerHp, playerMax);
  updateHpBar(enemyBar, enemyHp, enemyMax);

  const actionsEl = overlay.querySelector('.actions');
  const offensiveContainer = overlay.querySelector('.offensive-skill-buttons');
  const defensiveContainer = overlay.querySelector('.defensive-skill-buttons');
  const itemContainer = overlay.querySelector('.item-buttons');
  const autoBtn = overlay.querySelector('#auto-battle-toggle');
  const logEl = overlay.querySelector('.log');
  const log = initLogPanel(overlay, enemy.name, player.name || 'Player');

  if (autoBtn) {
    autoBtn.textContent = combatState.autoBattle
      ? t('combat.auto.on')
      : t('combat.auto.off');
    autoBtn.addEventListener('click', () => {
      combatState.autoBattle = !combatState.autoBattle;
      autoBtn.textContent = combatState.autoBattle
        ? t('combat.auto.on')
        : t('combat.auto.off');
    });
  }

  await loadItems();

  const delayMap = { instant: 0, normal: 300 };
  const animDelay = delayMap[gameState.settings?.combatSpeed || 'normal'];

  initCombatState(player, enemy);
  const firstActor = initTurnOrder();
  let playerTurn = firstActor?.isPlayer ?? true;
  if (!playerTurn) setTimeout(enemyTurn, animDelay);
  player = combatState.players[0];
  enemy = combatState.enemies[0];
  const queueEl = overlay.querySelector('.turn-queue');
  function updateTurnQueue() {
    renderTurnQueue(
      queueEl,
      combatState.turnQueue,
      combatState.activeEntity,
      combatState.turnIndex
    );
    const act = combatState.activeEntity;
    if (act) {
      const idx = act.isPlayer
        ? combatState.players.indexOf(act)
        : combatState.enemies.indexOf(act);
      highlightActing(overlay, act.isPlayer, idx);
    }
  }
  updateTurnQueue();
  document.addEventListener('turnStarted', updateTurnQueue);

  function autoAct(e) {
    const unit = e.detail;
    if (!unit?.isPlayer || !combatState.autoBattle) return;
    const skillObjs = (unit.learnedSkills || [])
      .map((id) => getSkill(id))
      .filter(Boolean);
    const skill = chooseBestSkill(skillObjs, unit, (s) => skillCooldowns[s.id] > 0);
    if (skill) handleAction(skill);
  }
  document.addEventListener('turnStarted', autoAct);

  // reveal UI after intro animation
  setTimeout(() => {
    actionsEl.classList.remove('hidden');
    logEl.classList.remove('hidden');
  }, animDelay + 500);

  let shieldBlock = false;
  let enemyGuard = false;
  let sparkUsed = false;
  let reflectActive = false;
  const skillCooldowns = {};
  initSkillPreview(overlay, (id) => skillCooldowns[id] || 0);

  function damagePlayer(dmg) {
    let amount = dmg;
    if (player.evasionChance && Math.random() < player.evasionChance) {
      log(t('combat.miss', { attacker: enemy.name }));
      return 0;
    }
    if (shieldBlock) {
      amount = 0;
      shieldBlock = false;
    }
    const totals = getTotalStats();
    const tempTarget = {
      hp: playerHp,
      stats: { defense: (totals.defense || 0) + player.tempDefense },
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
    log(t('combat.attack', { attacker: enemy.name, amount: applied }));
    if (reflectActive && applied > 0) {
      damageEnemy(applied);
      log(t('combat.reflect'));
      reflectActive = false;
    }
    if (player.hasTemplePassive && applied > 0) {
      enemyHp = Math.max(0, enemyHp - 2);
      enemy.hp = enemyHp;
      updateHpBar(enemyBar, enemyHp, enemyMax);
      log(t('combat.sacredCounter'));
      healPlayer(1);
    }
    return applied;
  }

  function damageEnemy(baseDmg) {
    if (enemy.evadeNext) {
      log(t('combat.miss', { attacker: 'Player' }));
      removeStatusLogged(enemy, 'evade_next');
      enemy.evadeNext = false;
      return 0;
    }
    if (enemy.evasionChance && Math.random() < enemy.evasionChance) {
      log(t('combat.miss', { attacker: 'Player' }));
      return 0;
    }
    const totals = getTotalStats();
    let dmg = baseDmg + (totals.attack || 0) + (player.tempAttack || 0);
    if (typeof player.damageModifier === 'number') {
      dmg *= player.damageModifier;
    }
    if (typeof player.bonusDamage === 'number') {
      dmg += player.bonusDamage;
      player.bonusDamage = 0;
    }
    if (enemyGuard) {
      dmg = Math.max(0, dmg - 4);
      enemyGuard = false;
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
    log(t('combat.attack', { attacker: 'Player', amount: applied }));
    return applied;
  }

  function healPlayer(amount) {
    playerHp = Math.min(playerMax, playerHp + amount);
    player.hp = playerHp;
    updateHpBar(playerBar, playerHp, playerMax);
    playerBar.classList.add('damage');
    setTimeout(() => playerBar.classList.remove('damage'), 300);
    log(t('combat.heal', { target: 'Player', amount }));
  }

  function applyStatusLogged(target, id, duration) {
    applyStatusEffect(target, id, duration);
    const name = t(`status.${id}`);
    const who = target === player ? 'Player' : enemy.name;
    log(t('combat.status.apply', { target: who, status: name, turns: duration }));
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
  }

  function removeStatusLogged(target, id) {
    removeStatusEffect(target, id);
    const name = t(`status.${id}`);
    const who = target === player ? 'Player' : enemy.name;
    log(t('combat.status.expire', { status: name, target: who }));
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
  }

  function removeNegativeStatusLogged(target, ids) {
    const removed = removeNegativeStatusEffect(target, ids);
    removed.forEach((r) => {
      const name = t(`status.${r}`);
      const who = target === player ? 'Player' : enemy.name;
      log(t('combat.status.expire', { status: name, target: who }));
    });
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
    return removed;
  }

  function activateGuard() {
    applyStatusEffect(player, 'guarded', 2);
  }

  function activateShieldBlock() {
    shieldBlock = true;
  }

  function activateEnemyGuard() {
    enemyGuard = true;
  }

  function tickCooldowns() {
    Object.keys(skillCooldowns).forEach((id) => {
      if (skillCooldowns[id] > 0) skillCooldowns[id]--;
    });
  }

  function triggerDeathEffect() {
    if (!enemy.deathSkill || enemy.deathUsed) return;
    const skill = getEnemySkill(enemy.deathSkill);
    if (skill) {
      log(`${enemy.name} ${skill.name}`);
      skill.effect({
        enemy,
        player,
        damagePlayer,
        applyStatus: applyStatusLogged,
        log
      });
    }
    enemy.deathUsed = true;
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
    const items = getItemsByCategory('combat');
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

  Object.entries(skillButtons).forEach(([id, btn]) => {
    const skill = skillLookup[id];
    if (!btn || !skill) return;
    btn.addEventListener('mouseenter', () => showSkillPreview(skill));
    btn.addEventListener('mouseleave', hideSkillPreview);
    btn.addEventListener('touchstart', () => showSkillPreview(skill));
    btn.addEventListener('touchend', hideSkillPreview);
  });

  updateItemsUI();
  document.addEventListener('inventoryUpdated', updateItemsUI);
  setupTabs(overlay);
  updateStatusUI(overlay, player, enemy);
  updateSkillDisableState();

  function updateSkillDisableState() {
    const silenced =
      hasStatus(player, 'silence') || hasStatus(player, 'silenced');
    setSkillDisabledState(skillButtons, skillLookup, silenced, skillCooldowns);
  }

  async function handleAction(skill) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    if (hasStatus(player, 'paralyzed') && Math.random() < 0.5) {
      log(t('combat.paralyzed', { enemy: 'Player' }));
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      const nextActor = nextTurn();
      playerTurn = nextActor?.isPlayer ?? true;
      if (!playerTurn) setTimeout(enemyTurn, animDelay);
      return;
    }
    if (hasStatus(player, 'confused') && Math.random() < 0.33) {
      log(t('combat.confused', { enemy: 'Player' }));
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      const nextActor = nextTurn();
      playerTurn = nextActor?.isPlayer ?? true;
      if (!playerTurn) setTimeout(enemyTurn, animDelay);
      return;
    }
    if (hasStatus(player, 'unstable') && Math.random() < 0.25) {
      log(t('combat.unstable', { enemy: 'Player' }));
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      const nextActor = nextTurn();
      playerTurn = nextActor?.isPlayer ?? true;
      if (!playerTurn) setTimeout(enemyTurn, animDelay);
      return;
    }
    const silenced =
      hasStatus(player, 'silenced') || hasStatus(player, 'silence');
    if (silenced && skill.category === 'offensive' && !skill.silenceExempt) {
      log(t('combat.silenced'));
      return;
    }
    if (skillCooldowns[skill.id] > 0) {
      log(t('combat.cooldown', { skill: skill.name, turns: skillCooldowns[skill.id] }));
      return;
    }
    player.selectedSkillId = skill.id;
    const icon = skill.icon ? `${skill.icon} ` : '';
    log(t('combat.skill.use', { user: 'Player', skillName: `${icon}${skill.name}` }));
    discoverSkill(skill.id);
    const result = skill.effect({
      damageEnemy,
      healPlayer,
      activateGuard,
      activateShieldBlock,
      log,
      applyStatus: applyStatusLogged,
      removeStatus: removeStatusLogged,
      removeNegativeStatus: removeNegativeStatusLogged,
      player,
      enemy
    });
    if (result === false) return; // invalid action
    if (skill.cooldown > 0) {
      skillCooldowns[skill.id] = skill.cooldown;
    }
    handlePhaseTriggers();
    if (enemyHp <= 0) {
      triggerDeathEffect();
      log(t('combat.defeat.enemy', { enemy: enemy.name }));
      discover('enemies', enemy.id);
      await giveDrops();
      if (enemy.id === 'echo_absolute') {
        recordEnding('victory', 'echo absolute');
        echoAbsoluteVictory();
        setBossDefeated();
        spawnNpc(10, 10, 'krealer');
      }
      showVictoryMessage();
      setTimeout(endCombat, animDelay + 500);
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
      log(t('combat.defeat.player'));
      endCombat();
      return;
    }
    const nextActor = nextTurn();
    playerTurn = nextActor?.isPlayer ?? true;
    if (!playerTurn) setTimeout(enemyTurn, animDelay);
  }

  function handleItemUse(id) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    if (hasStatus(player, 'cursed')) {
      log(t('combat.item.curseBlock'));
      return;
    }
    let used = false;
    const data = getItemData(id);
    if (data) log(t('combat.item.use', { user: 'Player', item: data.name }));
    if (id === 'health_potion') {
      const res = useHealthPotion();
      if (res) {
        let amount = res.heal;
        const classBonus = getClassBonuses();
        if (classBonus.itemHealBonus) amount += classBonus.itemHealBonus;
        healPlayer(amount);
        log(t('combat.heal', { target: 'Player', amount }));
        logMessage(`Player used ${data.name}!`);
        used = true;
      } else {
        log('No potion available.');
      }
    }
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
        applyStatusLogged(player, 'defense_boost');
        log(`Defense increased by ${amount} for this fight!`);
        logMessage(`Player used ${data.name}!`);
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
        applyStatusLogged(player, 'defense_boost');
        log(`Defense increased by ${amount} for this fight!`);
        logMessage(`Player used ${data.name}!`);
        used = true;
      } else {
        log('No potion available.');
      }
    }
    if (id === 'faded_blade') {
      const res = useFadedBlade();
      if (res) {
        log(`Attack increased by ${res.attack} for this fight!`);
        logMessage(`Player used ${data.name}!`);
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
          logMessage(`Player used ${data.name}!`);
          used = true;
        } else {
          log('No spark available.');
        }
      }
    }
    if (id === 'mana_gem') {
      const res = useManaGem();
      if (res) {
        Object.keys(skillCooldowns).forEach((k) => (skillCooldowns[k] = 0));
        log('Skill cooldowns refreshed!');
        logMessage(`Player used ${data.name}!`);
        used = true;
      } else {
        log('No gem available.');
      }
    }
    if (id === 'stamina_dust') {
      const res = useStaminaDust();
      if (res) {
        const key = Object.keys(skillCooldowns).find(
          (k) => skillCooldowns[k] > 0
        );
        if (key) skillCooldowns[key] = Math.max(0, skillCooldowns[key] - 1);
        log('One skill cooldown reduced!');
        logMessage(`Player used ${data.name}!`);
        used = true;
      } else {
        log('No dust available.');
      }
    }
    if (id === 'reflect_potion') {
      const res = useReflectPotion();
      if (res) {
        reflectActive = true;
        log('You brace for the next attack.');
        logMessage(`Player used ${data.name}!`);
        used = true;
      } else {
        log('No potion available.');
      }
    }
    if (id === 'mana_scroll') {
      const res = useManaScroll();
      if (res) {
        Object.keys(skillCooldowns).forEach((k) => (skillCooldowns[k] = 0));
        log('All skills ready to use!');
        logMessage(`Player used ${data.name}!`);
        used = true;
      } else {
        log('No scroll available.');
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
      const nextActor = nextTurn();
      playerTurn = nextActor?.isPlayer ?? true;
      if (!playerTurn) setTimeout(enemyTurn, animDelay);
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
    document.removeEventListener('turnStarted', updateTurnQueue);
    document.removeEventListener('turnStarted', autoAct);
    clearActiveTile();
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
    enemy.turnCount = (enemy.turnCount || 0) + 1;
    if (enemy.id === 'chimebound_monk' && enemy.turnCount === 3) {
      const skill = getEnemySkill('meditate');
      if (skill) {
        log(t('combat.skill.use', { user: enemy.name, skillName: skill.name }));
        skill.effect({ enemy, log });
        if (enemyHp < enemy.maxHp) enemyHp = enemy.hp;
      }
    }
    if (hasStatus(enemy, 'paralyzed') && Math.random() < 0.5) {
      log(t('combat.paralyzed', { enemy: enemy.name }));
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      const nextActor = nextTurn();
      playerTurn = nextActor?.isPlayer ?? true;
      tickCooldowns();
      updateSkillDisableState();
      if (!playerTurn) setTimeout(enemyTurn, animDelay);
      return;
    }
    if (hasStatus(enemy, 'confused') && Math.random() < 0.33) {
      log(t('combat.confused', { enemy: enemy.name }));
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      const nextActor = nextTurn();
      playerTurn = nextActor?.isPlayer ?? true;
      tickCooldowns();
      updateSkillDisableState();
      if (!playerTurn) setTimeout(enemyTurn, animDelay);
      return;
    }
    if (hasStatus(enemy, 'unstable') && Math.random() < 0.25) {
      log(t('combat.unstable', { enemy: enemy.name }));
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      const nextActor = nextTurn();
      playerTurn = nextActor?.isPlayer ?? true;
      tickCooldowns();
      updateSkillDisableState();
      if (!playerTurn) setTimeout(enemyTurn, animDelay);
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

    if (enemy.id === 'cracked_crystal_sentry') {
      enemy.prismCooldown = enemy.prismCooldown || 0;
      if (enemy.prismCooldown > 0) enemy.prismCooldown--;
      const currentDef = enemy.stats?.defense || 0;
      if (currentDef >= 30 && enemy.prismCooldown === 0) {
        skill = getEnemySkill('prism_crack');
        enemy.prismCooldown = skill.cooldown;
      } else {
        skill = getEnemySkill('refract_crack');
      }
    } else if (enemy.id === 'crystal_sentry') {
      const currentDef = enemy.stats?.defense || 0;
      if (currentDef < 20) {
        skill = getEnemySkill('refract_guard');
      } else {
        skill = getEnemySkill('prism_shot');
      }
    } else if (enemy.id === 'warden_threshold') {
      enemy.cooldowns = enemy.cooldowns || {
        earthbind: 0,
        resolve_break: 0,
        quaking_step: 0
      };
      for (const k in enemy.cooldowns) {
        if (enemy.cooldowns[k] > 0) enemy.cooldowns[k]--;
      }
      const opts = [];
      if (enemy.cooldowns.earthbind === 0) opts.push('earthbind');
      if (enemy.cooldowns.resolve_break === 0) opts.push('resolve_break');
      if (enemy.cooldowns.quaking_step === 0) opts.push('quaking_step');
      const choice = opts.length
        ? opts[Math.floor(Math.random() * opts.length)]
        : null;
      if (choice) {
        skill = getEnemySkill(choice);
        if (skill.cooldown > 0) enemy.cooldowns[choice] = skill.cooldown;
      } else {
        skill = getEnemySkill('stone_lash');
      }
    } else if (enemy.cycleSkills && list.length) {
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
          log(t('combat.silenced')); // enemy silenced
          tickStatusEffects(player, log);
          tickStatusEffects(enemy, log);
          const nextActor = nextTurn();
          playerTurn = nextActor?.isPlayer ?? true;
          tickCooldowns();
          updateSkillDisableState();
          if (!playerTurn) setTimeout(enemyTurn, animDelay);
          return;
        }
      }
    }

    if (skill) {
      const icon = skill.icon ? `${skill.icon} ` : '';
      log(t('combat.skill.use', { user: enemy.name, skillName: `${icon}${skill.name}` }));
      discoverSkill(skill.id);
      skill.effect({
        player,
        enemy,
        damagePlayer,
        applyStatus: applyStatusLogged,
        removeStatus: removeStatusLogged,
        removeNegativeStatus: removeNegativeStatusLogged,
        log,
        activateEnemyGuard
      });
    }
    if (playerHp <= 0) {
      log(t('combat.defeat.player'));
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
      log(t('combat.defeat.player'));
      if (enemy.id === 'echo_absolute') {
        recordEnding('defeat', 'echo absolute');
        echoAbsoluteDefeat();
      }
      endCombat();
      return;
    }
    if (enemyHp <= 0) {
      triggerDeathEffect();
      log(t('combat.defeat.enemy', { enemy: enemy.name }));
      discover('enemies', enemy.id);
      giveDrops();
      if (enemy.id === 'echo_absolute') {
        recordEnding('victory', 'echo absolute');
        echoAbsoluteVictory();
        setBossDefeated();
        spawnNpc(10, 10, 'krealer');
      }
      showVictoryMessage();
      setTimeout(endCombat, animDelay + 500);
      return;
    }
    const nextActor = nextTurn();
    playerTurn = nextActor?.isPlayer ?? true;
    tickCooldowns();
    updateSkillDisableState();
    if (!playerTurn) setTimeout(enemyTurn, animDelay);
  }
}
