/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/dialogue/memory.js', () => ({
  setMemory: jest.fn()
}));

jest.unstable_mockModule('../scripts/dialogue_system.js', () => ({
  showDialogue: jest.fn()
}));

jest.unstable_mockModule('../scripts/ending_manager.js', () => ({
  recordEnding: jest.fn()
}));

jest.unstable_mockModule('../scripts/player_memory.js', () => ({
  getEchoConversationCount: jest.fn(() => 0),
  recordLore: jest.fn()
}));

jest.unstable_mockModule('../scripts/relic_state.js', () => ({
  getOwnedRelics: jest.fn(() => [])
}));

let flags, memoryMod, dialogueSys, endingMgr;

beforeEach(async () => {
  jest.resetModules();
  flags = await import('../scripts/dialogue/flags.js');
  memoryMod = await import('../scripts/dialogue/memory.js');
  dialogueSys = await import('../scripts/dialogue_system.js');
  endingMgr = await import('../scripts/ending_manager.js');
});

test('flagMetLioran calls setMemory', () => {
  flags.flagMetLioran();
  expect(memoryMod.setMemory).toHaveBeenCalledWith('met_lioran');
});

test('echoAbsoluteDefeat records ending and shows dialogue', () => {
  flags.echoAbsoluteDefeat();
  expect(endingMgr.recordEnding).toHaveBeenCalledWith(
    'defeat',
    'Consumed by the Absolute'
  );
  expect(dialogueSys.showDialogue).toHaveBeenCalled();
});
