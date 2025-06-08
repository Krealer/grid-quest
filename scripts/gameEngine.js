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
 * @returns {{name:string,description:string}|null} the item granted or null if already opened
 */
export function openChestAt(x, y) {
  if (isChestOpened(x, y)) {
    return null;
  }
  openedChests.add(`${x},${y}`);
  // In the future this could look up items based on map data. For now each
  // chest grants a single hard-coded item object with name and description.
  return {
    name: 'Mysterious Key',
    description: 'A rusty key of unknown origin.',
  };
}

/**
 * Determines if two grid positions are directly adjacent horizontally or
 * vertically.
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {boolean}
 */
export function isAdjacent(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}
