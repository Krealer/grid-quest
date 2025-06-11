export function showConfirm(message, onConfirm, onCancel) {
  const overlay = document.getElementById('confirm-overlay');
  if (!overlay) {
    if (confirm(message)) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
    return;
  }
  const msgEl = overlay.querySelector('#confirm-message');
  const yesBtn = overlay.querySelector('.confirm-yes');
  const cancelBtn = overlay.querySelector('.confirm-cancel');
  msgEl.textContent = message;
  overlay.classList.add('active');
  function cleanup() {
    overlay.classList.remove('active');
    yesBtn.removeEventListener('click', handleYes);
    cancelBtn.removeEventListener('click', handleCancel);
  }
  function handleYes() {
    cleanup();
    onConfirm();
  }
  function handleCancel() {
    cleanup();
    if (onCancel) onCancel();
  }
  yesBtn.addEventListener('click', handleYes);
  cancelBtn.addEventListener('click', handleCancel);
}
