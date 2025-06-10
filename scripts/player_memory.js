const STORAGE_KEY = 'gridquest.memory';

const memory = {
  npcs: new Set(),
  enemies: new Set(),
  items: new Set(),
  skills: new Set(),
  lore: new Set(),
  maps: new Set(),
  krealerFlags: new Set(),
  forkChoice: null,
  forksVisited: { left: false, right: false },
  sealPuzzleSolved: false,
  sealingDust: false,
  mirrorPuzzleSolved: false,
  corruptionPuzzleSolved: false,
  rotationPuzzleSolved: false,
  echoes: new Set(),
  shadowFightTriggered: false,
  ideologyReward: null,
  loreRelicCount: 0
};

function loadMemory() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.npcs)) memory.npcs = new Set(data.npcs);
    if (Array.isArray(data.enemies)) memory.enemies = new Set(data.enemies);
    if (Array.isArray(data.items)) memory.items = new Set(data.items);
    if (Array.isArray(data.skills)) memory.skills = new Set(data.skills);
    if (Array.isArray(data.lore)) memory.lore = new Set(data.lore);
    if (Array.isArray(data.maps)) memory.maps = new Set(data.maps);
    if (typeof data.forkChoice === 'string')
      memory.forkChoice = data.forkChoice;
    if (data.forksVisited)
      memory.forksVisited = { ...memory.forksVisited, ...data.forksVisited };
    if (typeof data.sealPuzzleSolved === 'boolean')
      memory.sealPuzzleSolved = data.sealPuzzleSolved;
    if (typeof data.sealingDust === 'boolean')
      memory.sealingDust = data.sealingDust;
    if (typeof data.mirrorPuzzleSolved === 'boolean')
      memory.mirrorPuzzleSolved = data.mirrorPuzzleSolved;
    if (typeof data.corruptionPuzzleSolved === 'boolean')
      memory.corruptionPuzzleSolved = data.corruptionPuzzleSolved;
    if (typeof data.rotationPuzzleSolved === 'boolean')
      memory.rotationPuzzleSolved = data.rotationPuzzleSolved;
    if (Array.isArray(data.krealerFlags))
      memory.krealerFlags = new Set(data.krealerFlags);
    if (Array.isArray(data.echoes)) memory.echoes = new Set(data.echoes);
    if (typeof data.shadowFightTriggered === 'boolean')
      memory.shadowFightTriggered = data.shadowFightTriggered;
    if (typeof data.ideologyReward === 'string')
      memory.ideologyReward = data.ideologyReward;
    if (typeof data.loreRelicCount === 'number')
      memory.loreRelicCount = data.loreRelicCount;
  } catch {
    // ignore
  }
}

function saveMemory() {
  const data = {
    npcs: Array.from(memory.npcs),
    enemies: Array.from(memory.enemies),
    items: Array.from(memory.items),
    skills: Array.from(memory.skills),
    lore: Array.from(memory.lore),
    maps: Array.from(memory.maps),
    forkChoice: memory.forkChoice,
    forksVisited: memory.forksVisited,
    sealPuzzleSolved: memory.sealPuzzleSolved,
    sealingDust: memory.sealingDust,
    mirrorPuzzleSolved: memory.mirrorPuzzleSolved,
    corruptionPuzzleSolved: memory.corruptionPuzzleSolved,
    rotationPuzzleSolved: memory.rotationPuzzleSolved,
    krealerFlags: Array.from(memory.krealerFlags),
    echoes: Array.from(memory.echoes),
    shadowFightTriggered: memory.shadowFightTriggered,
    ideologyReward: memory.ideologyReward,
    loreRelicCount: memory.loreRelicCount
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

loadMemory();

export function discover(type, id) {
  if (!id || !memory[type]) return;
  if (!memory[type].has(id)) {
    memory[type].add(id);
    saveMemory();
    document.dispatchEvent(
      new CustomEvent('memoryUpdated', { detail: { type, id } })
    );
  }
}

export function hasDiscovered(type, id) {
  return !!memory[type] && memory[type].has(id);
}

export function getDiscovered(type) {
  return memory[type] ? Array.from(memory[type]) : [];
}

export function discoverSkill(id) {
  discover('skills', id);
}

export function discoverLore(id) {
  discover('lore', id);
}

export function discoverMap(id) {
  discover('maps', id);
}

export function setForkChoice(path) {
  memory.forkChoice = path;
  saveMemory();
}

export function getForkChoice() {
  return memory.forkChoice;
}

export function markForkVisited(path) {
  if (path === 'left' || path === 'right') {
    memory.forksVisited[path] = true;
    saveMemory();
  }
}

export function visitedBothForks() {
  return memory.forksVisited.left && memory.forksVisited.right;
}

export function solveSealPuzzle() {
  memory.sealPuzzleSolved = true;
  memory.sealingDust = true;
  saveMemory();
}

export function isSealPuzzleSolved() {
  return memory.sealPuzzleSolved;
}

export function hasSealingDust() {
  return memory.sealingDust;
}

export function consumeSealingDust() {
  if (memory.sealingDust) {
    memory.sealingDust = false;
    saveMemory();
  }
}

export function solveMirrorPuzzle() {
  memory.mirrorPuzzleSolved = true;
  saveMemory();
}

export function isMirrorPuzzleSolved() {
  return memory.mirrorPuzzleSolved;
}

export function solveCorruptionPuzzle() {
  memory.corruptionPuzzleSolved = true;
  saveMemory();
}

export function isCorruptionPuzzleSolved() {
  return memory.corruptionPuzzleSolved;
}

export function solveRotationPuzzle() {
  memory.rotationPuzzleSolved = true;
  saveMemory();
}

export function isRotationPuzzleSolved() {
  return memory.rotationPuzzleSolved;
}

export function recordEchoConversation(id) {
  if (!id) return;
  if (!memory.echoes.has(id)) {
    memory.echoes.add(id);
    saveMemory();
    document.dispatchEvent(
      new CustomEvent('echoesUpdated', {
        detail: { count: memory.echoes.size }
      })
    );
  }
}

export function getEchoConversationCount() {
  return memory.echoes.size;
}

export function markShadowFight() {
  if (!memory.shadowFightTriggered) {
    memory.shadowFightTriggered = true;
    saveMemory();
  }
}

export function isShadowFightMarked() {
  return memory.shadowFightTriggered;
}

export function setIdeologyReward(id) {
  memory.ideologyReward = id;
  saveMemory();
}

export function getIdeologyReward() {
  return memory.ideologyReward;
}

export function incrementLoreRelicCount() {
  memory.loreRelicCount += 1;
  saveMemory();
}

export function getLoreRelicCount() {
  return memory.loreRelicCount;
}

export function setKrealerFlag(id) {
  if (!id) return;
  if (!memory.krealerFlags.has(id)) {
    memory.krealerFlags.add(id);
    saveMemory();
  }
}

export function hasKrealerFlag(id) {
  return memory.krealerFlags.has(id);
}

export function getKrealerFlags() {
  return Array.from(memory.krealerFlags);
}

export function allKrealerFlagsSet() {
  const ids = [
    'flag_krealer1',
    'flag_krealer2',
    'flag_krealer3',
    'flag_krealer4',
    'flag_krealer5',
    'flag_krealer6',
    'flag_krealer7',
    'flag_krealer8'
  ];
  return ids.every(id => memory.krealerFlags.has(id));
}
