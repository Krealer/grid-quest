export function initMenuBar(onSave, onLoad) {
  const saveBtn = document.querySelector('#menu-bar .save-tab');
  const loadBtn = document.querySelector('#menu-bar .load-tab');
  if (saveBtn && typeof onSave === 'function') {
    saveBtn.addEventListener('click', onSave);
  }
  if (loadBtn && typeof onLoad === 'function') {
    loadBtn.addEventListener('click', onLoad);
  }

  const bar = document.getElementById('menu-bar');
  function updateLayout() {
    if (!bar) return;
    if (window.innerWidth < 480) {
      bar.classList.add('stacked');
    } else {
      bar.classList.remove('stacked');
    }
  }
  updateLayout();
  window.addEventListener('resize', updateLayout);
}
