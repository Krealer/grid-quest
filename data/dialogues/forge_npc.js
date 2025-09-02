import { loadUpgradeData, listUpgradeableItems, listRerollableItems, beginForgeSession, canUpgrade, canReroll } from '../../scripts/forge.js';
import { showDialogue } from '../../scripts/dialogueSystem.js';
import { getItemDisplayName, parseItemId } from '../../scripts/inventory.js';

export async function createForgeDialogue() {
  await loadUpgradeData();
  beginForgeSession();
  const items = listUpgradeableItems();
  const rerollables = listRerollableItems();
  const options = items.map(it => ({
    label: `Upgrade ${getItemDisplayName(it.id)}`,
    goto: null,
    condition: () => canUpgrade(it.id),
    triggerUpgrade: it.id,
    onChoose: async () => {
      const { baseId, level } = parseItemId(it.id);
      const newId = `${baseId}+${level + 1}`;
      showDialogue(`Your ${getItemDisplayName(newId)} has been strengthened.`);
    }
  }));
  rerollables.forEach(it => {
    options.push({
      label: `Reroll ${getItemDisplayName(it.id)}`,
      goto: null,
      condition: () => canReroll(it.id),
      triggerReroll: it.id,
      onChoose: () => {
        showDialogue('Let\'s see what magic emerges...');
      }
    });
  });
  options.push({ label: 'Maybe later.', goto: null });
  return [
    {
      text: 'Welcome to my forge. Care to reforge something?',
      options
    }
  ];
}


