let dialogueLines = {};
let dataLoaded = false;

async function loadDialogData() {
  if (dataLoaded) return;
  try {
    const res = await fetch('data/dialog.json');
    if (res.ok) {
      dialogueLines = await res.json();
    }
  } catch (err) {
    console.error('Failed to load dialog data', err);
  } finally {
    dataLoaded = true;
  }
}

export async function showDialogue(keyOrText, callback = () => {}) {
  await loadDialogData();
  const text = dialogueLines[keyOrText] || keyOrText || '';

  const overlay = document.createElement('div');
  overlay.id = 'dialogue-overlay';
  overlay.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-text"></div>
      <div class="dialogue-advance">\u2192</div>
    </div>`;
  document.body.appendChild(overlay);
  const textEl = overlay.querySelector('.dialogue-text');
  const advance = overlay.querySelector('.dialogue-advance');
  advance.style.display = 'none';

  let index = 0;
  const speed = 30; // ms per char

  function typeNext() {
    if (index < text.length) {
      textEl.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);
    } else {
      advance.style.display = 'block';
      overlay.querySelector('.dialogue-box').classList.add('finished');
    }
  }
  typeNext();

  function finish() {
    if (index < text.length) {
      textEl.textContent = text;
      index = text.length;
      advance.style.display = 'block';
      overlay.querySelector('.dialogue-box').classList.add('finished');
    } else {
      cleanup();
      callback();
    }
  }

  function keyHandler(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      finish();
    }
  }

  function cleanup() {
    overlay.removeEventListener('click', finish);
    document.removeEventListener('keydown', keyHandler);
    overlay.remove();
  }

  overlay.addEventListener('click', finish);
  document.addEventListener('keydown', keyHandler);
}
