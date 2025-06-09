import * as router from './router.js';

/**
 * Move the player to a given map and coordinates.
 * @param {string} mapId - Map filename or id (without .json).
 * @param {{x:number,y:number}} coords - Destination coordinates.
 * @returns {Promise<number>} Number of columns in the new map grid.
 */
export async function movePlayerTo(mapId, coords) {
  const name = mapId.replace(/\.json$/, '');
  const { cols } = await router.loadMap(name, coords);
  return cols;
}
