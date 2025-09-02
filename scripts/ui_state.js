import { hasCodeFile } from './inventory.js';
import { showDialogue } from './dialogue_system.js';
import { toggleNullSummary } from '../ui/null_summary.js';


export function initNullTab(tab) {
  if (!tab) return;
  tab.addEventListener('click', () => {
    if (!hasCodeFile()) {
      showDialogue('Obtain code file to enter.');
      return;
    }
    toggleNullSummary();
  });
}
