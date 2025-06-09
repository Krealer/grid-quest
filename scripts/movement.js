let disabled = false;

export function disableMovement() {
  disabled = true;
}

export function enableMovement() {
  disabled = false;
}

export function isMovementDisabled() {
  return disabled;
}
