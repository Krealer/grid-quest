import { hasStatus } from './status_manager.js';
import { setSkillDisabledState } from './combat_ui.js';

export function updateSkillDisableState(buttonMap, skillLookup, player, cooldowns = {}) {
  const silenced =
    hasStatus(player, 'silence') || hasStatus(player, 'silenced');
  setSkillDisabledState(buttonMap, skillLookup, silenced, cooldowns);
}
