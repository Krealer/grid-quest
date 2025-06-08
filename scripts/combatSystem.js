
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
    <div class="actions"></div>
    <div class="log"></div>`;

  document.body.appendChild(overlay);

  const playerBar = overlay.querySelector('.player .hp');
  const enemyBar = overlay.querySelector('.enemy .hp');

  const playerMax = 100;
  const enemyMax = enemy.hp || 50;
  let playerHp = playerMax;
  let enemyHp = enemyMax;

  updateHpBar(playerBar, playerHp, playerMax);
  updateHpBar(enemyBar, enemyHp, enemyMax);

  const actionsEl = overlay.querySelector('.actions');
  const logEl = overlay.querySelector('.log');

  function log(msg) {
    const entry = document.createElement('div');
    entry.textContent = msg;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
    console.log(msg);
  }

  let guardActive = false;
  let healUsed = false;
  let playerTurn = true;

  const skills = {
    strike: {
      name: 'Strike',
      execute() {
        const dmg = 15;
        enemyHp = Math.max(0, enemyHp - dmg);
        log(`Player strikes for ${dmg} damage!`);
        updateHpBar(enemyBar, enemyHp, enemyMax);
        enemyBar.classList.add('damage');
        setTimeout(() => enemyBar.classList.remove('damage'), 300);
      },
    },
    guard: {
      name: 'Guard',
      execute() {
        guardActive = true;
        log('Player braces for impact.');
      },
    },
    heal: {
      name: 'Heal',
      execute() {
        if (healUsed) {
          log('Heal can only be used once!');
          return false;
        }
        healUsed = true;
        playerHp = Math.min(playerMax, playerHp + 20);
        log('Player heals for 20 HP.');
        updateHpBar(playerBar, playerHp, playerMax);
        playerBar.classList.add('damage');
        setTimeout(() => playerBar.classList.remove('damage'), 300);
      },
    },
  };

  Object.values(skills).forEach(skill => {
    const btn = document.createElement('button');
    btn.textContent = skill.name;
    btn.addEventListener('click', () => handleAction(skill));
    actionsEl.appendChild(btn);
  });

  function handleAction(skill) {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    const result = skill.execute();
    if (result === false) return; // invalid action
    if (enemyHp <= 0) {
      log(`${enemy.name} was defeated!`);
      endCombat();
      return;
    }
    playerTurn = false;
    setTimeout(enemyTurn, 300);
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

  function enemyTurn() {
    if (enemyHp <= 0) return;
    let dmg = 8;
    if (guardActive) {
      dmg = Math.max(0, dmg - 5);
      guardActive = false;
    }
    playerHp = Math.max(0, playerHp - dmg);
    log(`${enemy.name} attacks for ${dmg} damage!`);
    updateHpBar(playerBar, playerHp, playerMax);
    playerBar.classList.add('damage');
    setTimeout(() => playerBar.classList.remove('damage'), 300);
    if (playerHp <= 0) {
      log('Player was defeated!');
      endCombat();
      return;
    }
    playerTurn = true;
  }
}
