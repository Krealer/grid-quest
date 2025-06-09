export function showError(message) {
  if (typeof document !== 'undefined' && typeof alert === 'function') {
    alert(message);
  } else {
    console.error(message);
  }
}
