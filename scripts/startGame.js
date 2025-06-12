import { isFogEnabled } from './mapLoader.js';
import * as router from './router.js';
import { initFog, reveal, revealAll } from './fog_system.js';
import { player } from './player.js';
import { handleTileClick, isPlayerMoving } from './grid_click.js';
import { handleTileInteraction } from './interaction.js';
import { npcModules } from './npc/index.js';
import { defeatEnemy } from './enemy.js';
import { spawnEnemy } from './map.js';
import { setMemory } from './dialogue_state.js';
import { hasItem } from './inventory.js';
import {
  completeQuest,
  isQuestStarted,
  isQuestCompleted,
} from './quest_state.js';
import { gameState } from './game_state.js';
import {
  updateHpDisplay,
  updateDefenseDisplay,
  updateXpDisplay,
} from './ui/playerDisplay.js';
import { isMovementDisabled } from './movement.js';

let isInBattle = false;

export async function startGame(container, settings, state) {
  try {
    const { cols: newCols } = await router.loadMap('map01');
    state.cols = newCols;
    initFog(container, state.cols, isFogEnabled());
    if (isFogEnabled()) {
      if (router.getCurrentMapName() === 'map01') {
        revealAll();
      } else {
        reveal(player.x, player.y);
      }
    }
    updateHpDisplay();
    updateXpDisplay();

    container.addEventListener('click', (e) =>
      handleTileClick(e, player, container, state.cols, settings, isInBattle)
    );
    container.addEventListener('dblclick', async (e) => {
      if (isInBattle || isPlayerMoving() || isMovementDisabled()) return;
      const newCols = await handleTileInteraction(
        e,
        player,
        container,
        state.cols,
        npcModules
      );
      if (newCols) {
        state.cols = newCols;
        initFog(container, state.cols, isFogEnabled());
        if (isFogEnabled()) {
          if (router.getCurrentMapName() === 'map01') {
            revealAll();
          } else {
            reveal(player.x, player.y);
          }
        }
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
      state.cols = e.detail.cols;
      initFog(container, state.cols, isFogEnabled());
      if (isFogEnabled()) {
        revealAll();
      }
      updateHpDisplay();
      updateDefenseDisplay();
      updateXpDisplay();
    });
    document.addEventListener('playerDefenseChanged', updateDefenseDisplay);
    document.addEventListener('playerHpChanged', updateHpDisplay);
    document.addEventListener('playerXpChanged', updateXpDisplay);
    document.addEventListener('playerLevelUp', updateXpDisplay);
    document.addEventListener('passivesUpdated', () => {
      updateHpDisplay();
      updateDefenseDisplay();
    });
  } catch (err) {
    console.error(err);
  }
}
