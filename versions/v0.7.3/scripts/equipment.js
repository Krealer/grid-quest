import { player } from './player.js';

const SET_PASSIVE_ID = 'temple_harmony';

export function checkTempleSet() {
  const eq = player.equipment || {};
  const hasSet =
    eq.weapon?.startsWith('temple_sword') &&
    eq.armor?.startsWith('temple_shell') &&
    eq.accessory?.startsWith('temple_ring');
  player.templeSetActive = !!hasSet;
  document.dispatchEvent(new CustomEvent('equipmentSetChecked'));
}
