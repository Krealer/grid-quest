export const TILE_INFO = {
  G: { color: '#8b6f47', shape: 'square', walkable: true, interactable: false },
  W: { color: '#0080ff', shape: 'square', walkable: false, interactable: true },
  F: { color: '#555555', shape: 'square', walkable: false, interactable: false },
  t: { color: '#aaaaaa', shape: 'square', walkable: true, interactable: false },
  T: { color: '#444444', shape: 'square', walkable: true, interactable: false },
  C: { color: '#d4af37', shape: 'square', walkable: false, interactable: true },
  D: { color: '#5a381e', shape: 'square', walkable: false, interactable: true },
  N: { color: '#9b59b6', shape: 'circle', walkable: false, interactable: true },
  n: { color: '#ffffff', shape: 'circle', walkable: false, interactable: true },
  E: { color: '#e74c3c', shape: 'triangle', walkable: false, interactable: true },
  A: { color: '#c0392b', shape: 'triangle', walkable: false, interactable: true },
  B: { color: '#8b0000', shape: 'triangle', walkable: false, interactable: true },
  X: { color: '#330000', shape: 'triangle', walkable: false, interactable: true }
};

export function getTileInfo(symbol) {
  return TILE_INFO[symbol] || { color: '#777', shape: 'square', walkable: true, interactable: false };
}
