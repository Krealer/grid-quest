
let overlay = null;

function updateHpBar(bar, current, max) {
  bar.style.width = `${(current / max) * 100}%`;
}

/**
 * Starts a basic turn-based combat encounter.
 * @param {{name:string,hp:number}} enemy The enemy to fight.
 */
export function startCombat(enemy) {
  const gridEl = document.getElementById('game-grid');
  if (!gridEl) return;

  gridEl.classList.add('blurred');

  overlay = document.createElement('div');
  overlay.id = 'battle-overlay';
  overlay.innerHTML = `
    <div class="combatant player">
      <div class="name">Hero</div>
      <div class="hp-bar"><div class="hp"></div></div>
    </div>
    <div class="combatant enemy">
      <div class="name">${enemy.name}</div>
      <div class="hp-bar"><div class="hp"></div></div>
    </div>
    <div class="actions">
      <button id="attack-btn">Attack</button>
      <button id="defend-btn">Defend</button>
    </div>`;

  document.body.appendChild(overlay);

  const playerBar = overlay.querySelector('.player .hp');
  const enemyBar = overlay.querySelector('.enemy .hp');

  const playerMax = 100;
  const enemyMax = enemy.hp || 50;
  let playerHp = playerMax;
  let enemyHp = enemyMax;

  updateHpBar(playerBar, playerHp, playerMax);
  updateHpBar(enemyBar, enemyHp, enemyMax);

  function log(msg) {
    console.log(msg);
  }

  function endCombat() {
    log('Combat ended');
    gridEl.classList.remove('blurred');
    overlay.remove();
    overlay = null;
    document.dispatchEvent(
      new CustomEvent('combatEnded', { detail: { playerHp, enemyHp, enemy } })
    );
  }

  function enemyTurn(damageMod = 0) {
    if (enemyHp <= 0) return;
    const dmg = Math.max(0, 8 - damageMod);
    playerHp = Math.max(0, playerHp - dmg);
    log(`${enemy.name} attacks for ${dmg} damage!`);
    updateHpBar(playerBar, playerHp, playerMax);
    if (playerHp <= 0) {
      log('Player was defeated!');
      endCombat();
    }
  }

  overlay.querySelector('#attack-btn').addEventListener('click', () => {
    if (playerHp <= 0 || enemyHp <= 0) return;
    const dmg = 10;
    enemyHp = Math.max(0, enemyHp - dmg);
    log(`Player attacks for ${dmg} damage!`);
    updateHpBar(enemyBar, enemyHp, enemyMax);
    if (enemyHp <= 0) {
      log(`${enemy.name} was defeated!`);
      endCombat();
      return;
    }
    setTimeout(() => enemyTurn(), 300);
  });

  overlay.querySelector('#defend-btn').addEventListener('click', () => {
    if (playerHp <= 0 || enemyHp <= 0) return;
    log('Player defends.');
    setTimeout(() => enemyTurn(5), 300);
  });
}
