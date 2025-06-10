const STORAGE_KEY = 'gridquest.finalFlags';

export const finalFlags = {
  bossDefeated: false,
  ending: null,
  phase: 1
};

export function loadFinalFlags() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const data = JSON.parse(json);
    if (typeof data.bossDefeated === 'boolean') finalFlags.bossDefeated = data.bossDefeated;
    if (typeof data.ending === 'string') finalFlags.ending = data.ending;
    if (typeof data.phase === 'number') finalFlags.phase = data.phase;
  } catch {}
}

export function saveFinalFlags() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(finalFlags));
}

export function setBossDefeated() {
  finalFlags.bossDefeated = true;
  saveFinalFlags();
}

export function setEnding(id) {
  finalFlags.ending = id;
  saveFinalFlags();
}

export function setPhase(n) {
  finalFlags.phase = n;
  saveFinalFlags();
}

loadFinalFlags();
