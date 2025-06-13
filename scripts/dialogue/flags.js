import { getOwnedRelics } from '../relic_state.js';
import { getEchoConversationCount, recordLore } from '../player_memory.js';
import { recordEnding } from '../ending_manager.js';
import { showDialogue } from '../dialogue_system.js';
import { setMemory } from './memory.js';

export function echoAbsoluteIntro() {
  const echoes = getEchoConversationCount();
  const relics = getOwnedRelics().length;
  const line = `All ${echoes} echoes and ${relics} relics converge into one form.`;
  showDialogue(line);
}

export function echoAbsoluteVictory() {
  showDialogue('The Absolute fades, leaving clarity behind.', () => {
    recordLore('pattern_end');
    recordEnding('victory', 'Echo Absolute defeated');
  });
}

export function echoAbsoluteDefeat() {
  showDialogue('Memories scatter as darkness takes hold.', () => {
    recordEnding('defeat', 'Consumed by the Absolute');
  });
}

export function flagMetFirstMemory() {
  setMemory('met_first_memory');
}

export function flagEryndorSkillGiven() {
  setMemory('eryndor_skill_given');
}

export function flagMetLioran() {
  setMemory('met_lioran');
}

export function flagObtainedArcaneSpark() {
  setMemory('obtained_arcane_spark');
}

export function flagRiftLurkerDefeated() {
  setMemory('rift_lurker_defeated');
}

export function flagTradedForPrismKey() {
  setMemory('traded_for_prism_key');
}

export function flagTradedWithKaelor() {
  setMemory('traded_with_kaelor');
}

export function flagManipulatedByVerrel() {
  setMemory('manipulated_by_verrel');
}

export function vicarDoorMessageNorth() {
  showDialogue('A holy seal binds this passage.');
}

export function vicarDoorMessageExit() {
  showDialogue('You may only proceed with proof of dominion.');
}
