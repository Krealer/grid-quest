import { showDialogue } from './dialogueSystem.js';
import { getForkChoice } from './player_memory.js';

const bosses = {
  whispered_mirror: { phase: 1 }
};

export function resetBossPhase(id) {
  if (bosses[id]) bosses[id].phase = 1;
}

export function advanceBossPhase(enemy) {
  const data = bosses[enemy.id];
  if (!data) return;
  const pct = enemy.hp / enemy.maxHp;
  if (data.phase === 1 && pct <= 0.7) {
    data.phase = 2;
    showDialogue('The mirror fractures, a clone emerges!');
  } else if (data.phase === 2 && pct <= 0.3) {
    data.phase = 3;
    const choice = getForkChoice();
    if (choice === 'left') {
      enemy.tempAttack += 5;
    } else if (choice === 'right') {
      enemy.tempDefense += 5;
    }
    showDialogue('Memories surge through the mirror!');
  }
}
