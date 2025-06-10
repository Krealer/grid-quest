import { getCurrentGrid } from './mapLoader.js';
import { handleTileEffects } from './gameEngine.js';
import { toggleInventoryView } from './inventory_state.js';
import { toggleQuestLog } from './quest_log.js';
import { player, getTotalStats, stepTo } from './player.js';
import { initFog, reveal } from './fog_system.js';
import { getRelicBonuses } from './relic_state.js';
import { loadEnemyData, defeatEnemy } from './enemy.js';
import { setMemory } from './dialogue_state.js';
import {
  completeQuest,
  isQuestStarted,
  isQuestCompleted
} from './quest_state.js';
import { findPath } from './pathfinder.js';
import * as router from './router.js';
import { showDialogue } from './dialogueSystem.js';
import { handleTileInteraction } from './interaction.js';
import { isMovementDisabled } from './movement.js';
import { hasCodeFile, hasItem } from './inventory.js';
import { movePlayerTo, spawnEnemy } from './map.js';
import * as eryndor from './npc/eryndor.js';
import * as coren from './npc/coren.js';
import * as goblinQuestGiver from './npc/goblin_quest_giver.js';
import * as arvalin from './npc/arvalin.js';
import * as grindle from './npc/grindle.js';
import * as forgeNpc from './npc/forge_npc.js';
import * as shadeSage from './npc/shade_sage.js';
import * as forkGuide from './npc/fork_guide.js';
import * as watcher from './npc/watcher.js';
import * as flamebound from './npc/flamebound.js';
import * as arbiter from './npc/arbiter.js';
import * as loreStatue from './npc/lore_statue.js';
import * as silentMonument from './npc/silent_monument.js';
import * as breathlessNight from './npc/breathless_night.js';
import * as corruptionShrine from './npc/corruption_shrine.js';
import * as vaultkeeper from './npc/vaultkeeper.js';
import * as loreObelisk from './npc/lore_obelisk.js';
import * as dreamEcho1 from './npc/dream_echo1.js';
import * as dreamEcho2 from './npc/dream_echo2.js';
import * as relicChamber from './npc/relic_chamber.js';
import * as secondVoice from './npc/second_voice.js';
import * as echoSelfShadow from './npc/echo_self_shadow.js';
import * as echoSelfFlame from './npc/echo_self_flame.js';
import * as echoSelfPeace from './npc/echo_self_peace.js';
import * as echoMemory from './npc/echo_memory.js';
import * as ember from './npc/ember.js';
import * as veil from './npc/veil.js';
import * as firstMemory from './npc/first_memory.js';
import * as krealer from './npc/krealer.js';
import * as krealer1 from './npc/krealer1.js';
import * as krealer2 from './npc/krealer2.js';
import * as krealer3 from './npc/krealer3.js';
import * as krealer4 from './npc/krealer4.js';
import * as krealer5 from './npc/krealer5.js';
import * as krealer6 from './npc/krealer6.js';
import * as krealer7 from './npc/krealer7.js';
import * as krealer8 from './npc/krealer8.js';
import { initNullTab } from './ui_state.js';
import { initNullSummary } from '../ui/null_summary.js';
import { initSkillSystem } from './skills.js';
import { initPassiveSystem } from './passive_skills.js';
import { toggleStatusPanel } from './menu/status.js';
import { toggleInfoPanel, initInfoPanel } from './info_panel.js';
import { saveState, loadState, gameState } from './game_state.js';
import { saveGame, loadGame } from './save_system.js';
import {
  loadSettings,
  saveSettings,
  applySettings
} from './settingsManager.js';

// Inventory contents are managed in inventory.js

let isInBattle = false;
const npcModules = {
  eryndor,
  coren,
  goblinQuestGiver,
  arvalin,
  grindle,
  forgeNpc,
  shadeSage,
  forkGuide,
  watcher,
  flamebound,
  arbiter,
  loreStatue,
  silentMonument,
  breathlessNight,
  corruptionShrine,
  vaultkeeper,
  loreObelisk,
  dreamEcho1,
  dreamEcho2,
  relicChamber,
  secondVoice,
  echoSelfShadow,
  echoSelfFlame,
  echoSelfPeace,
  echoMemory,
  ember,
  veil,
  krealer,
  krealer1,
  krealer2,
  krealer3,
  krealer4,
  krealer5,
  krealer6,
  krealer7,
  krealer8,
  firstMemory
};

let hpDisplay;
let defenseDisplay;
let xpDisplay;

function updateHpDisplay() {
  if (hpDisplay) {
    const bonus = getRelicBonuses().maxHp || 0;
    hpDisplay.textContent = `HP: ${player.hp}/${player.maxHp + bonus}`;
  }
}

function updateDefenseDisplay() {
  if (defenseDisplay) {
    const stats = getTotalStats();
    defenseDisplay.textContent = `Defense: ${stats.defense || 0}`;
  }
}

function updateXpDisplay() {
  if (xpDisplay) {
    xpDisplay.textContent = `Level: ${player.level} XP: ${player.xp}/${player.xpToNextLevel}`;
  }
}

let isMoving = false;

function handleTileClick(e, player, container, cols) {
  if (isMoving || isInBattle || isMovementDisabled()) return;
  const target = e.target;
  if (!target.classList.contains('tile')) return;
  const x = Number(target.dataset.x);
  const y = Number(target.dataset.y);
  const grid = getCurrentGrid();
  const tileType = grid[y][x].type;

  // Doors are interacted with via double-click, so they are not walkable.
  if (!['G', 't', 'T', 'W'].includes(tileType)) return;

  const path = findPath(grid, player.x, player.y, x, y);
  if (path.length === 0) return;

  let index = 0;
  isMoving = true;
  async function step() {
    if (index >= path.length) {
      isMoving = false;
      return;
    }
    const pos = path[index];
    stepTo(pos.x, pos.y);
    router.drawPlayer(player, container, cols);
    const tile = grid[player.y][player.x];
    await handleTileEffects(tile.type, player, player.x, player.y);
    updateHpDisplay();
    index++;
    setTimeout(() => requestAnimationFrame(step), 150);
  }
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('game-grid');
  const inventoryTab = document.querySelector('.inventory-tab');
  const inventoryOverlay = document.getElementById('inventory-overlay');
  const closeBtn = inventoryOverlay.querySelector('.close-btn');
  const questsTab = document.querySelector('.quests-tab');
  const questsOverlay = document.getElementById('quest-log-overlay');
  const questsClose = questsOverlay.querySelector('.close-btn');
  const statusTab = document.querySelector('.status-tab');
  const nullTab = document.querySelector('.null-tab');
  const statusOverlay = document.getElementById('status-overlay');
  const statusClose = statusOverlay?.querySelector('.close-btn');
  const infoTab = document.querySelector('.info-tab');
  const infoOverlay = document.getElementById('info-overlay');
  const infoClose = infoOverlay?.querySelector('.close-btn');
  const settingsTab = document.querySelector('.settings-tab');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsClose = settingsOverlay.querySelector('.close-btn');
  const saveTab = document.querySelector('.save-tab');
  const loadTab = document.querySelector('.load-tab');
  const soundToggle = document.getElementById('sound-toggle');
  const scaleSelect = document.getElementById('ui-scale');
  const animToggle = document.getElementById('anim-toggle');
  hpDisplay = document.getElementById('hp-display');
  defenseDisplay = document.getElementById('defense-display');
  xpDisplay = document.getElementById('xp-display');
  updateHpDisplay();
  updateDefenseDisplay();
  updateXpDisplay();
  let cols = 0;

  let settings = loadSettings();
  applySettings(settings);
  soundToggle.checked = settings.sound;
  scaleSelect.value = settings.scale;
  animToggle.checked = settings.animations;

  router.init(container, player);
  initSkillSystem(player);
  initPassiveSystem(player);
  initInfoPanel();
  initNullSummary();

  try {
    await loadEnemyData();
  } catch (e) {
    console.error('Failed to load enemies', e);
  }

  inventoryTab.addEventListener('click', toggleInventoryView);
  closeBtn.addEventListener('click', toggleInventoryView);
  inventoryOverlay.addEventListener('click', (e) => {
    if (e.target === inventoryOverlay) toggleInventoryView();
  });
  questsTab.addEventListener('click', toggleQuestLog);
  questsClose.addEventListener('click', toggleQuestLog);
  questsOverlay.addEventListener('click', (e) => {
    if (e.target === questsOverlay) toggleQuestLog();
  });
  if (statusTab) statusTab.addEventListener('click', toggleStatusPanel);
  if (statusClose) statusClose.addEventListener('click', toggleStatusPanel);
  if (statusOverlay) {
    statusOverlay.addEventListener('click', (e) => {
      if (e.target === statusOverlay) toggleStatusPanel();
    });
  }
  if (infoTab) infoTab.addEventListener('click', toggleInfoPanel);
  if (infoClose) infoClose.addEventListener('click', toggleInfoPanel);
  if (infoOverlay) {
    infoOverlay.addEventListener('click', (e) => {
      if (e.target === infoOverlay) toggleInfoPanel();
    });
  }

  function updateNullTab() {
    if (!nullTab) return;
    if (hasCodeFile()) {
      nullTab.classList.remove('disabled');
    } else {
      nullTab.classList.add('disabled');
    }
  }

  if (nullTab) {
    initNullTab(nullTab);
    updateNullTab();
  }
  document.addEventListener('inventoryUpdated', updateNullTab);

  function showSettings() {
    settingsOverlay.classList.add('active');
  }

  function hideSettings() {
    settingsOverlay.classList.remove('active');
  }

  settingsTab.addEventListener('click', showSettings);
  settingsClose.addEventListener('click', hideSettings);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) hideSettings();
  });

  soundToggle.addEventListener('change', () => {
    settings.sound = soundToggle.checked;
    saveSettings(settings);
  });

  scaleSelect.addEventListener('change', () => {
    settings.scale = scaleSelect.value;
    applySettings(settings);
    saveSettings(settings);
  });

  animToggle.addEventListener('change', () => {
    settings.animations = animToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  saveTab.addEventListener('click', () => {
    saveState();
    saveGame();
    showDialogue('Game saved!');
  });

  loadTab.addEventListener('click', async () => {
    loadState();
    loadGame();
    const mapName = gameState.currentMap || 'map01';
    try {
      const { cols: newCols } = await router.loadMap(mapName);
      cols = newCols;
      player.maxHp = 100 + (gameState.maxHpBonus || 0);
      player.hp = Math.min(player.hp, player.maxHp);
      updateHpDisplay();
      updateXpDisplay();
      showDialogue('Game loaded!');
    } catch (err) {
      console.error(err);
    }
  });

  try {
    const { cols: newCols } = await router.loadMap('map01');
    cols = newCols;
    initFog(container, cols);
    reveal(player.x, player.y);
    updateHpDisplay();
    updateXpDisplay();

    container.addEventListener('click', (e) =>
      handleTileClick(e, player, container, cols)
    );
    container.addEventListener('dblclick', async (e) => {
      if (isInBattle || isMoving || isMovementDisabled()) return;
      const newCols = await handleTileInteraction(
        e,
        player,
        container,
        cols,
        npcModules
      );
      if (newCols) {
        cols = newCols;
        initFog(container, cols);
        reveal(player.x, player.y);
        updateHpDisplay();
      }
    });
    document.addEventListener('combatStarted', () => {
      isInBattle = true;
    });
    document.addEventListener('combatEnded', (e) => {
      isInBattle = false;
      if (e.detail.enemyHp <= 0) {
        const enemyId = e.detail.enemy.id;
        defeatEnemy(enemyId);
        if (
          enemyId === 'goblin01' &&
          !hasItem('goblin_ear') &&
          !hasItem('goblin_insignia') &&
          !hasItem('cracked_helmet')
        ) {
          const pos = gameState.lastEnemyPos;
          if (pos) spawnEnemy(pos.x, pos.y, 'ghost_echo');
        }
        if (enemyId === 'goblin_scout') {
          setMemory('scout_defeated');
          if (
            isQuestStarted('scout_tracking') &&
            !isQuestCompleted('scout_tracking')
          ) {
            completeQuest('scout_tracking');
          }
        }
        if (enemyId === 'zombie01') {
          setMemory('flag_zombie_defeated');
        }
      }
    });

    document.addEventListener('playerRespawned', (e) => {
      cols = e.detail.cols;
      updateHpDisplay();
      updateDefenseDisplay();
      updateXpDisplay();
    });
    document.addEventListener('playerDefenseChanged', updateDefenseDisplay);
    document.addEventListener('playerXpChanged', updateXpDisplay);
    document.addEventListener('playerLevelUp', updateXpDisplay);
    document.addEventListener('passivesUpdated', () => {
      updateHpDisplay();
      updateDefenseDisplay();
    });
  } catch (err) {
    console.error(err);
  }
});
