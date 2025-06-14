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
    enemyCol.appendChild(box);
  }

  combatants.appendChild(playerCol);
  combatants.appendChild(logBox);
  combatants.appendChild(enemyCol);
  root.appendChild(combatants);

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.innerHTML = `
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
