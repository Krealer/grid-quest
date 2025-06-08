// Game engine state management for interactive objects such as chests.

const openedChests = new Set();

/**
 * Clears all tracked chest state. Intended to be called when a new map is
 * loaded.
 */
export function resetChestState() {
  openedChests.clear();
}

/**
 * Determines if the chest at the provided coordinates has already been opened.
 *
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function isChestOpened(x, y) {
  return openedChests.has(`${x},${y}`);
}

/**
 * Marks the chest at the given coordinates as opened and returns an item if it
 * wasn't opened before. If the chest has already been opened this function
 * returns null.
 *
 * @param {number} x
 * @param {number} y
 * @returns {string|null} the item granted or null if already opened
 */
export function openChestAt(x, y) {
  if (isChestOpened(x, y)) {
    return null;
  }
  openedChests.add(`${x},${y}`);
  // In the future this could look up items based on map data. For now each
  // chest grants a single hard-coded item.
  return 'Mysterious Key';
}
