import { upgradeItem, rerollEnchantment } from './forge.js';
import { addRelic } from './relic_state.js';
import { addItem } from './inventory.js';
import { loadItems, getItemData } from './item_loader.js';
import { getOwnedRelics } from './relic_state.js';
import {
  discover,
  discoverLore as recordLore,
  setForkChoice,
  visitedBothForks,
  getForkChoice,
  recordEchoConversation,
  setIdeologyReward,
  incrementLoreRelicCount,
  setKrealerFlag
} from './player_memory.js';
import { getEchoConversationCount } from './player_memory.js';
import { recordEnding } from './ending_manager.js';
import { showDialogue } from './dialogueSystem.js';
import { chooseClass as selectClass } from './class_state.js';
import { player } from './player.js';
import { clearCorruption } from './corruption_state.js';
import { unlockRelicSlot, unlockPortal15 } from './player_state.js';
import {
  dialogueMemory,
  dialogueBranches,
  dialogueState,
  getActiveDialogue,
  setMemory,
  hasMemory,
  setBranchChoice,
  getBranchChoice,
  startSession,
  endSession
} from './dialogue/memory.js';
import {
  krealer1Dialogue,
  krealer2Dialogue,
  krealer3Dialogue,
  krealer4Dialogue,
  krealer5Dialogue,
  krealer6Dialogue,
  krealer7Dialogue,
  krealer8Dialogue
} from './dialogue/krealer_dialogues.js';
import {
  echoAbsoluteIntro,
  echoAbsoluteVictory,
  echoAbsoluteDefeat,
  flagMetFirstMemory,
  flagEryndorSkillGiven,
  flagMetLioran,
  flagObtainedArcaneSpark,
  flagRiftLurkerDefeated,
  flagTradedForPrismKey,
  flagTradedWithKaelor,
  flagManipulatedByVerrel,
  vicarDoorMessageNorth,
  vicarDoorMessageExit
} from './dialogue/flags.js';


export async function triggerUpgrade(id) {
  if (id) await upgradeItem(id);
}

export async function triggerReroll(id) {
  if (id) await rerollEnchantment(id);
}

// Give a relic to the player
export function giveRelic(id) {
  if (id) {
    addRelic(id);
    recordLore(id);
    incrementLoreRelicCount();
  }
}

// Unlock a lore entry
export function discoverLore(id) {
  if (id) recordLore(id);
}

// Set the player's class if not already chosen
export function chooseClass(id) {
  if (id && selectClass(id)) {
    player.classId = id;
  }
}

export function chooseForkPath(path) {
  if (!path) return;
  setForkChoice(path);
  if (path === 'left') {
    showDialogue(
      'A Watcher nods from the shadows, approving your stealthy choice.'
    );
  } else if (path === 'right') {
    showDialogue(
      'Flamebound warriors roar in welcome as you choose the fiery road.'
    );
  }
}

export function arbiterDialogue() {
  if (visitedBothForks()) {
    showDialogue('You have proven mastery over both paths.');
    discoverLore('two_flames_crossed');
  } else {
    showDialogue(
      "Only those who walk both paths may claim the mirror's power."
    );
  }
}

export function loreStatue() {
  showDialogue('Weathered runes speak of times long past.', () => {
    discoverLore('before_the_seal');
  });
}

export function ruinsScholar() {
  showDialogue('These stones remember the First Collapse.', () => {
    discoverLore('first_collapse');
  });
}

export function map08Npc() {
  showDialogue('The threshold crumbles, but paths still lie ahead.', () => {
    discoverLore('thresholds_ruined');
  });
}

export function silentMonument() {
  showDialogue('The monument hums softly beneath the silence.', () => {
    discoverLore('beneath_the_silence');
  });
}

export function breathlessNight() {
  showDialogue('An inscription whispers of the Breathless Night.', () => {
    discoverLore('breathless_night');
  });
}

export function firstMemory() {
  showDialogue('A faded etching recalls your first memory.', () => {
    discoverLore('first_memory');
  });
}

export function corruptionShrine() {
  showDialogue('A purifying light washes over you.', () => {
    clearCorruption();
  });
}

export function vaultkeeperHints() {
  showDialogue(
    'The floor obeys the sigils. Step upon them and the vault shall turn.'
  );
}

export function mirrorBossIntro() {
  showDialogue('The mirror stirs, reflecting every step you have taken.');
}

export function loreObelisk() {
  showDialogue('Ancient glyphs shift with your reflection.', () => {
    discoverLore('reflections_deepself');
  });
}

export function dreamEchoOne() {
  showDialogue('A soft whisper floats by.', () => {
    discoverLore('dream_fragment_one');
  });
}

export function dreamEchoTwo() {
  showDialogue('Shimmering motes form fleeting words.', () => {
    discoverLore('dream_fragment_two');
  });
}

export function fieldNoteDisintegration() {
  showDialogue('Fragments detail how decay reduces all to dust.', () => {
    discoverLore('field_note_disintegration');
  });
}

export function relicChamber() {
  showDialogue('The chamber resonates with ancient power.', () => {
    unlockRelicSlot();
  });
}

export function secondVoice() {
  showDialogue('You face a reflection that is wholly your own.', () => {
    unlockPortal15();
  });
}

export function echoSelfShadow() {
  const choice = getForkChoice();
  const text =
    choice === 'left'
      ? 'This shadow mirrors the path you already chose.'
      : 'I am the you that stepped into darkness when you did not.';
  showDialogue(text, () => {
    recordEchoConversation('shadow');
  });
}

export function echoSelfFlame() {
  const choice = getForkChoice();
  const text =
    choice === 'right'
      ? 'Your flames already burn, yet I linger as possibility.'
      : 'I am the blaze you declined to ignite.';
  showDialogue(text, () => {
    recordEchoConversation('flame');
  });
}

export function echoSelfPeace() {
  showDialogue('I am the quiet path you never walked.', () => {
    recordEchoConversation('peace');
  });
}

export function echoMemory() {
  showDialogue('Fragments swirl, revealing what never came to pass.', () => {
    discoverLore('memory_not');
    recordEchoConversation('memory');
  });
}

export async function emberDialogue() {
  await loadItems();
  const data = getItemData('mystic_dust') || {
    name: 'Mystic Dust',
    description: ''
  };
  showDialogue('Embers gather, offering you their spark.', () => {
    addItem({ ...data, id: 'mystic_dust', quantity: 1 });
    setIdeologyReward('ember');
  });
}

export async function veilDialogue() {
  await loadItems();
  const data = getItemData('arcane_crystal') || {
    name: 'Arcane Crystal',
    description: ''
  };
  showDialogue('A cool hush surrounds you with hidden promise.', () => {
    addItem({ ...data, id: 'arcane_crystal', quantity: 1 });
    setIdeologyReward('veil');
  });
}

export async function krealerDialogue() {
  await loadItems();
  const data = getItemData('code_file') || {
    name: 'Code File',
    description: ''
  };
  showDialogue('Krealer hands you a shimmering code file.', () => {
    addItem({ ...data, id: 'code_file', quantity: 1 });
  });
}


export {
  dialogueMemory,
  dialogueBranches,
  dialogueState,
  getActiveDialogue,
  setMemory,
  hasMemory,
  setBranchChoice,
  getBranchChoice,
  startSession,
  endSession,
  krealer1Dialogue,
  krealer2Dialogue,
  krealer3Dialogue,
  krealer4Dialogue,
  krealer5Dialogue,
  krealer6Dialogue,
  krealer7Dialogue,
  krealer8Dialogue,
  echoAbsoluteIntro,
  echoAbsoluteVictory,
  echoAbsoluteDefeat,
  flagMetFirstMemory,
  flagEryndorSkillGiven,
  flagMetLioran,
  flagObtainedArcaneSpark,
  flagRiftLurkerDefeated,
  flagTradedForPrismKey,
  flagTradedWithKaelor,
  flagManipulatedByVerrel,
  vicarDoorMessageNorth,
  vicarDoorMessageExit
};
