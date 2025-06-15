export function createCombatLayout() {
  const root = document.createElement('div');
  root.className = 'combat-screen';

  const queue = document.createElement('div');
  queue.className = 'turn-queue spd-log spd-bar';
  root.appendChild(queue);

  const combatants = document.createElement('div');
  combatants.className = 'combatants';

  const playerCol = document.createElement('div');
  playerCol.className = 'player-team';
  for (let i = 0; i < 3; i++) {
    const box = document.createElement('div');
    box.className = 'combatant combat-box empty';
    box.dataset.index = i;
    const icon = document.createElement('div');
    icon.className = 'icon';
    box.appendChild(icon);
    const hp = document.createElement('div');
    hp.className = 'hp-bar';
    hp.innerHTML = '<div class="hp"></div>';
    box.appendChild(hp);
    playerCol.appendChild(box);
  }

  const logBox = document.createElement('div');
  logBox.id = 'combat-log';
  logBox.className = 'log-box log combat-log';

  const enemyCol = document.createElement('div');
  enemyCol.className = 'enemy-team';
  for (let i = 0; i < 3; i++) {
    const box = document.createElement('div');
    box.className = 'combatant combat-box empty';
    box.dataset.index = i;
    const icon = document.createElement('div');
    icon.className = 'icon';
    box.appendChild(icon);
    const hp = document.createElement('div');
    hp.className = 'hp-bar';
    hp.innerHTML = '<div class="hp"></div>';
    box.appendChild(hp);
    enemyCol.appendChild(box);
  }

  combatants.appendChild(playerCol);
  combatants.appendChild(logBox);
  combatants.appendChild(enemyCol);
  root.appendChild(combatants);

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.innerHTML = `
    <button id="auto-battle-toggle" class="auto-battle-btn auto-battle-button">Auto-Battle OFF</button>
    <div class="action-tabs">
      <button class="offensive-tab combat-skill-category">Offensive</button>
      <button class="defensive-tab combat-skill-category">Defensive</button>
      <button class="items-tab combat-skill-category">Items</button>
    </div>
    <div class="tab-panels">
      <div class="offensive-skill-buttons tab-panel"></div>
      <div class="defensive-skill-buttons tab-panel hidden"></div>
      <div class="item-buttons tab-panel hidden"></div>
    </div>`;
  root.appendChild(actions);
  return root;
}
