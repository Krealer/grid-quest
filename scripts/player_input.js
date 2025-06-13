export const pendingInputs = new Map();

export function waitForPlayerInput(player) {
  return new Promise((resolve) => {
    pendingInputs.set(player, resolve);
  });
}

export function submitPlayerInput(player, skill, target) {
  const cb = pendingInputs.get(player);
  if (cb) {
    pendingInputs.delete(player);
    cb({ skill, target });
  }
}
