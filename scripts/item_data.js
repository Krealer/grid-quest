export const itemData = {
  map02_key: {
    id: 'map02_key',
    name: 'Map02 Key',
    description: 'Required to unlock the path to the next map.',
    type: 'key',
    stackLimit: 1,
    icon: '🗝️'
  },
  health_amulet: {
    id: 'health_amulet',
    name: 'Health Amulet',
    description: 'Permanently increases max HP when found.',
    type: 'passive',
    stackLimit: 1,
    icon: '🩸'
  },
  empty_note: {
    id: 'empty_note',
    name: 'Empty Note',
    description: 'This chest was empty.',
    type: 'quest',
    stackLimit: 1,
    icon: '📝'
  }
};

export function getItemDataLocal(id) {
  return itemData[id];
}
