const state = {
  disabled: false,
};

export function disableMovement() {
  state.disabled = true;
}

export function enableMovement() {
  state.disabled = false;
}

export function isMovementDisabled() {
  return state.disabled;
}

export const movementState = state;
