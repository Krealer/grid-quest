let state = null;

const skills = {
  strike: {
    name: 'Strike',
    use(ctx) {
      ctx.enemy.hp -= 15;
      ctx.log('You strike the enemy for 15 damage.');
    },
  },
  guard: {
    name: 'Guard',
    use(ctx) {
      ctx.player.guard = true;
      ctx.log('You brace for the next attack.');
    },
  },
  heal: {
    name: 'Heal',
    used: false,
    use(ctx) {
      if (this.used) {
        ctx.log('Heal has already been used.');
        return;
      }
      ctx.player.hp = Math.min(ctx.player.maxHp, ctx.player.hp + 20);
      this.used = true;
      ctx.log('You restore 20 HP.');
    },
  },
};

function updateStatus() {
  const playerHp = document.getElementById('player-hp-display');
  const enemyHp = document.getElementById('enemy-hp-display');
  playerHp.textContent = `Player HP: ${state.player.hp}/${state.player.maxHp}`;
  enemyHp.textContent = `Enemy HP: ${state.enemy.hp}/${state.enemy.maxHp}`;
}

function appendLog(text) {
  const log = document.getElementById('combat-log');
  const line = document.createElement('div');
  line.textContent = text;
  log.prepend(line);
}

function closeBattle(grid, container, cols) {
  document.getElementById('battle-ui').classList.add('hidden');
  if (state.enemy.hp <= 0) {
    const idx = state.enemy.y * cols + state.enemy.x;
    grid[state.enemy.y][state.enemy.x].type = 'G';
    const tile = container.children[idx];
    if (tile) {
      tile.classList.remove('enemy', 'blocked');
      tile.classList.add('ground');
    }
  }
  state = null;
}

function enemyTurn(grid, container, cols) {
  if (!state) return;
  let damage = 10;
  if (state.player.guard) {
    damage = 5;
  }
  state.player.hp -= damage;
  state.player.guard = false;
  appendLog(`Enemy hits you for ${damage} damage.`);
  const playerHp = document.getElementById('player-hp-display');
  playerHp.classList.add('flash-damage');
  setTimeout(() => playerHp.classList.remove('flash-damage'), 300);
  updateStatus();
  if (state.player.hp <= 0) {
    appendLog('You were defeated.');
    closeBattle(grid, container, cols);
    return;
  }
  state.turn = 'player';
}

export function startBattle(player, enemy, grid, container, cols) {
  if (state) return; // already in battle
  state = { player, enemy, grid, container, cols, turn: 'player' };
  skills.heal.used = false;

  const ui = document.getElementById('battle-ui');
  ui.classList.remove('hidden');
  const skillMenu = document.getElementById('skill-menu');
  skillMenu.innerHTML = '';
  document.getElementById('combat-log').innerHTML = '';

  updateStatus();

  Object.keys(skills).forEach(key => {
    const skill = skills[key];
    const btn = document.createElement('button');
    btn.textContent = skill.name;
    btn.className = 'skill-button';
    if (key === 'heal' && skill.used) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (state.turn !== 'player') return;
      btn.classList.add('selected');
      skill.use({ player: state.player, enemy: state.enemy, log: appendLog });
      if (key === 'heal' && skill.used) {
        btn.disabled = true;
      }
      updateStatus();
      if (state.enemy.hp <= 0) {
        appendLog('Enemy defeated!');
        closeBattle(grid, container, cols);
        return;
      }
      state.turn = 'enemy';
      setTimeout(() => {
        enemyTurn(grid, container, cols);
        btn.classList.remove('selected');
      }, 500);
    });
    skillMenu.appendChild(btn);
  });
}

