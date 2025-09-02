export function showError(message) {
  const overlay = document.getElementById('error-overlay');
  if (!overlay) {
    alert(message);
    return;
  }
  const msgEl = overlay.querySelector('#error-message');
  const okBtn = overlay.querySelector('.error-ok');
  msgEl.textContent = message;
  overlay.classList.add('active');
  function hide() {
    overlay.classList.remove('active');
    okBtn.removeEventListener('click', hide);
  }
  okBtn.addEventListener('click', hide);
}
