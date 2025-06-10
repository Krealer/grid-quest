import { movePlayerTo } from './map.js';
import { hasCodeFile } from './inventory.js';
import { getCurrentMapName } from './router.js';
import { player } from './player.js';
import { showDialogue } from './dialogueSystem.js';

let returnMap = null;
let returnPos = null;

export function initNullTab(tab) {
  if (!tab) return;
  tab.addEventListener('click', async () => {
    const current = getCurrentMapName();
    if (current !== 'null_room') {
      if (!hasCodeFile()) {
        showDialogue('Obtain code file to enter.');
        return;
      }
      returnMap = current;
      returnPos = { x: player.x, y: player.y };
      document.dispatchEvent(new Event('openNullRoom'));
    } else {
      const map = returnMap || 'map01';
      const pos = returnPos || { x: 1, y: 1 };
      await movePlayerTo(map, pos);
    }
  });
}
