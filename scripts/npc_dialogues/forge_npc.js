import { loadUpgradeData, listUpgradeableItems, beginForgeSession, canUpgrade } from '../forge.js';
import { showDialogue } from '../dialogueSystem.js';
import { getItemDisplayName, parseItemId } from '../inventory.js';

export async function createForgeDialogue() {
  await loadUpgradeData();
  beginForgeSession();
  const items = listUpgradeableItems();
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
  options.push({ label: 'Maybe later.', goto: null });
  return [
    {
      text: 'Welcome to my forge. Care to reforge something?',
      options
    }
  ];
}


