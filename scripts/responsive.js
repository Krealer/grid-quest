export function isPortraitMobile() {
  return window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
}

export function onPortraitChange(cb) {
  const mq = window.matchMedia('(max-width: 768px) and (orientation: portrait)');
  function handler() {
    cb(mq.matches);
  }
  mq.addEventListener('change', handler);
  handler();
  return () => mq.removeEventListener('change', handler);
}
