import { getSkill } from './skills.js';
import { getEnemySkill } from './enemy_skills.js';
import { respawn, getTotalStats } from './player.js';
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
  showVictoryMessage
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
import { getElementMultiplier, formatElement } from './elements.js';

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
  const playerElement = formatElement(player.element);
  const enemyElement = formatElement(enemy.element);
  overlay.innerHTML = `
    <div class="combat-screen">
      <div class="combatants">
        <div class="combatant player">
          <div class="name">Zealer</div>
          ${playerElement ? `<div class="element">${playerElement}</div>` : ''}
          <div class="hp-bar"><div class="hp"></div></div>
          <div class="statuses status-effects player-statuses"></div>
        </div>
        <div class="combatant enemy intro-anim">
          <div class="portrait">${enemy.portrait || '👾'}</div>
          <div class="name">${enemy.name}</div>
          ${enemyElement ? `<div class="element">${enemyElement}</div>` : ''}
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
          <button class="attack-tab selected">Attack</button>
          <button class="non-attack-tab">Non-Attack</button>
          <button class="swap-tab">Swap</button>
        </div>
        <div class="tab-panels">
          <div class="attack-skill-buttons tab-panel"></div>
          <div class="non-attack-skill-buttons tab-panel hidden"></div>
          <div class="swap-buttons tab-panel hidden"></div>
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
  enemy.turnCount = 0;

  updateHpBar(playerBar, playerHp, playerMax);
  updateHpBar(enemyBar, enemyHp, enemyMax);

  const actionsEl = overlay.querySelector('.actions');
  const attackContainer = overlay.querySelector('.attack-skill-buttons');
  const nonAttackContainer = overlay.querySelector('.non-attack-skill-buttons');
  const swapContainer = overlay.querySelector('.swap-buttons');
  const logEl = overlay.querySelector('.log');

  const log = initLogPanel(overlay);

  await loadItems();

  const delayMap = { instant: 0, normal: 300 };
  const animDelay = delayMap[gameState.settings?.combatSpeed || 'normal'];

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
  let playerTurn = true;

  function damagePlayer(dmg) {
    let amount = dmg;
    if (player.evasionChance && Math.random() < player.evasionChance) {
      log('Zealer evades the attack!');
      return 0;
    }
    if (shieldBlock) {
      amount = 0;
      shieldBlock = false;
    }
    amount *= getElementMultiplier(enemy.element, player.element);
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
    log(`Zealer takes ${applied} damage`);
    if (reflectActive && applied > 0) {
      damageEnemy(applied);
      log('Reflected the damage back!');
      reflectActive = false;
    }
    if (player.hasTemplePassive && applied > 0) {
      enemyHp = Math.max(0, enemyHp - 2);
      enemy.hp = enemyHp;
      updateHpBar(enemyBar, enemyHp, enemyMax);
      log('Sacred Counter retaliates!');
      healPlayer(1);
    }
    return applied;
  }

  function damageEnemy(baseDmg, elementOverride = player.element) {
    if (enemy.evadeNext) {
      log(`${enemy.name}'s mirage takes the hit!`);
      removeStatusLogged(enemy, 'evade_next');
      enemy.evadeNext = false;
      return 0;
    }
    if (enemy.evasionChance && Math.random() < enemy.evasionChance) {
      log(`${enemy.name} evades the attack!`);
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
    const elem = elementOverride === null ? null : elementOverride;
    const mult = elem ? getElementMultiplier(elem, enemy.element) : 1;
    dmg *= mult;
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
    return applied;
  }

  function healPlayer(amount) {
    playerHp = Math.min(playerMax, playerHp + amount);
    player.hp = playerHp;
    updateHpBar(playerBar, playerHp, playerMax);
    playerBar.classList.add('damage');
    setTimeout(() => playerBar.classList.remove('damage'), 300);
    log(`Zealer heals ${amount} HP`);
  }

  function applyStatusLogged(target, id, duration) {
    applyStatusEffect(target, id, duration);
    const name = getStatusEffect(id)?.name || id;
    const who = target === player ? 'Zealer' : enemy.name;
    log(`${who} gains ${name}`);
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
  }

  function removeStatusLogged(target, id) {
    removeStatusEffect(target, id);
    const name = getStatusEffect(id)?.name || id;
    const who = target === player ? 'Zealer' : enemy.name;
    log(`${name} removed from ${who}`);
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
  }

  function removeNegativeStatusLogged(target, ids) {
    const removed = removeNegativeStatusEffect(target, ids);
    removed.forEach((r) => {
      const name = getStatusEffect(r)?.name || r;
      const who = target === player ? 'Zealer' : enemy.name;
      log(`${name} removed from ${who}`);
    });
    updateStatusUI(overlay, player, enemy);
    updateSkillDisableState();
    return removed;
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
  }

  function updateSwapUI() {
    swapContainer.innerHTML = '';
    const items = getItemsByCategory('combat');
    if (items.length === 0) {
      const msg = document.createElement('div');
      msg.textContent = 'No swaps available';
      swapContainer.appendChild(msg);
      return;
    }
    items.forEach((it) => {
      const data = getItemData(it.id);
      const btn = document.createElement('button');
      const qty = it.quantity > 1 ? ` x${it.quantity}` : '';
      btn.textContent = `${data.name}${qty}`;
      btn.addEventListener('click', () => handleSwap(it.id));
      swapContainer.appendChild(btn);
    });
  }

  const allSkills = (player.learnedSkills || [])
    .map((id) => getSkill(id))
    .filter(Boolean);

  const skillLookup = {};
  allSkills.forEach((s) => {
    skillLookup[s.id] = s;
  });

  const attackSkills = allSkills.filter((s) => s.category === 'attack');
  const nonAttackSkills = allSkills.filter((s) => s.category === 'non-attack');

  const attackButtons = renderSkillList(
    attackContainer,
    attackSkills,
    handleAction
  );
  const nonAttackButtons = renderSkillList(
    nonAttackContainer,
    nonAttackSkills,
    handleAction
  );
  const skillButtons = { ...attackButtons, ...nonAttackButtons };

  updateSwapUI();
  document.addEventListener('inventoryUpdated', updateSwapUI);
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
      log('Paralyzed! You cannot act.');
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = false;
      setTimeout(enemyTurn, animDelay);
      return;
    }
    if (hasStatus(player, 'confused') && Math.random() < 0.33) {
      log('Confused! You hesitate in bewilderment.');
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = false;
      setTimeout(enemyTurn, animDelay);
      return;
    }
    if (hasStatus(player, 'unstable') && Math.random() < 0.25) {
      log('Unstable! Your action falters.');
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = false;
      setTimeout(enemyTurn, animDelay);
      return;
    }
    const silenced =
      hasStatus(player, 'silenced') || hasStatus(player, 'silence');
    if (silenced && skill.category === 'attack' && !skill.silenceExempt) {
      log('You are silenced and cannot use attack skills.');
      return;
    }
    if (skillCooldowns[skill.id] > 0) {
      log(
        `${skill.name} is on cooldown for ${skillCooldowns[skill.id]} more turn(s).`
      );
      return;
    }
    const icon = skill.icon ? `${skill.icon} ` : '';
    log(`Zealer uses ${icon}${skill.name}`);
    discoverSkill(skill.id);
    const result = skill.effect({
      damageEnemy,
      healPlayer,
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
      log('Zealer was defeated!');
      endCombat();
      return;
    }
    playerTurn = false;
    setTimeout(enemyTurn, animDelay);
  }

  function handleSwap(id) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    if (hasStatus(player, 'cursed')) {
      log('A curse prevents you from swapping!');
      return;
    }
    let used = false;
    const data = getItemData(id);
    if (data) log(`Zealer uses ${data.name}`);
    if (id === 'health_potion') {
      const res = useHealthPotion();
      if (res) {
        let amount = res.heal;
        const classBonus = getClassBonuses();
        if (classBonus.itemHealBonus) amount += classBonus.itemHealBonus;
        healPlayer(amount);
        log(`Recovered ${amount} HP!`);
        logMessage(`Zealer used ${data.name}!`);
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
        logMessage(`Zealer used ${data.name}!`);
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
        logMessage(`Zealer used ${data.name}!`);
        used = true;
      } else {
        log('No potion available.');
      }
    }
    if (id === 'faded_blade') {
      const res = useFadedBlade();
      if (res) {
        log(`Attack increased by ${res.attack} for this fight!`);
        logMessage(`Zealer used ${data.name}!`);
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
          logMessage(`Zealer used ${data.name}!`);
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
        logMessage(`Zealer used ${data.name}!`);
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
        logMessage(`Zealer used ${data.name}!`);
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
        logMessage(`Zealer used ${data.name}!`);
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
        logMessage(`Zealer used ${data.name}!`);
        used = true;
      } else {
        log('No scroll available.');
      }
    }
    if (used) {
      updateSwapUI();
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerHp = player.hp;
      enemyHp = enemy.hp;
      updateHpBar(playerBar, playerHp, playerMax);
      updateHpBar(enemyBar, enemyHp, enemyMax);
      updateStatusUI(overlay, player, enemy);
      updateSkillDisableState();
      playerTurn = false;
      setTimeout(enemyTurn, animDelay);
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
    document.removeEventListener('inventoryUpdated', updateSwapUI);
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
        log(`${enemy.name} uses ${skill.name}`);
        skill.effect({ enemy, log });
        if (enemyHp < enemy.maxHp) enemyHp = enemy.hp;
      }
    }
    if (hasStatus(enemy, 'paralyzed') && Math.random() < 0.5) {
      log(`${enemy.name} is paralyzed and cannot act!`);
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = true;
      tickCooldowns();
      updateSkillDisableState();
      return;
    }
    if (hasStatus(enemy, 'confused') && Math.random() < 0.33) {
      log(`${enemy.name} looks confused and hesitates!`);
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = true;
      tickCooldowns();
      updateSkillDisableState();
      return;
    }
    if (hasStatus(enemy, 'unstable') && Math.random() < 0.25) {
      log(`${enemy.name} staggers in instability!`);
      tickStatusEffects(player, log);
      tickStatusEffects(enemy, log);
      playerTurn = true;
      tickCooldowns();
      updateSkillDisableState();
      return;
    }
    const enemySilenced =
      hasStatus(enemy, 'silenced') || hasStatus(enemy, 'silence');
    let list = (enemy.skills || ['strike'])
      .map((id) => getEnemySkill(id))
      .filter(Boolean);
    if (enemySilenced) {
      list = list.filter((s) => s.category !== 'attack');
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
    }
    else if (enemy.id === 'warden_threshold') {
      enemy.cooldowns = enemy.cooldowns || { earthbind: 0, resolve_break: 0, quaking_step: 0 };
      for (const k in enemy.cooldowns) { if (enemy.cooldowns[k] > 0) enemy.cooldowns[k]--; }
      const opts = [];
      if (enemy.cooldowns.earthbind === 0) opts.push('earthbind');
      if (enemy.cooldowns.resolve_break === 0) opts.push('resolve_break');
      if (enemy.cooldowns.quaking_step === 0) opts.push('quaking_step');
      const choice = opts.length ? opts[Math.floor(Math.random()*opts.length)] : null;
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
          log(`${enemy.name} is silenced and cannot act!`);
          tickStatusEffects(player, log);
          tickStatusEffects(enemy, log);
          playerTurn = true;
          tickCooldowns();
          updateSkillDisableState();
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
        log,
        activateEnemyGuard
      });
    }
    if (playerHp <= 0) {
      log('Zealer was defeated!');
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
      log('Zealer was defeated!');
      if (enemy.id === 'echo_absolute') {
        recordEnding('defeat', 'echo absolute');
        echoAbsoluteDefeat();
      }
      endCombat();
      return;
    }
    if (enemyHp <= 0) {
      triggerDeathEffect();
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
      setTimeout(endCombat, animDelay + 500);
      return;
    }
    playerTurn = true;
    tickCooldowns();
    updateSkillDisableState();
  }
}
