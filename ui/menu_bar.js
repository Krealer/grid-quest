export function initMenuBar(onSave, onLoad) {
  const saveBtn = document.querySelector('.save-tab');
  const loadBtn = document.querySelector('.load-tab');
  if (saveBtn && typeof onSave === 'function') {
    saveBtn.addEventListener('click', onSave);
  }
  if (loadBtn && typeof onLoad === 'function') {
    loadBtn.addEventListener('click', onLoad);
  }
}
