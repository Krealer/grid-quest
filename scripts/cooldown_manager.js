export function tickCooldowns(cooldowns = {}) {
  Object.keys(cooldowns).forEach((id) => {
    if (cooldowns[id] > 0) {
      cooldowns[id] -= 1;
    }
  });
}
