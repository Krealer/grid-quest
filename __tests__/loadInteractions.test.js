/** @jest-environment jsdom */
import { jest } from '@jest/globals';
import fs from 'fs';

const enterDoorMock = jest.fn(async () => 1);

jest.unstable_mockModule('../scripts/player.js', () => ({
  enterDoor: enterDoorMock
}));

jest.unstable_mockModule('../scripts/dialogueSystem.js', () => ({
  showDialogue: jest.fn((text, cb) => {
    if (typeof cb === 'function') cb();
  })
}));

jest.unstable_mockModule('../scripts/inventory_ui.js', () => ({
  updateInventoryUI: jest.fn()
}));

jest.unstable_mockModule('../info/items.js', () => ({
  markItemUsed: jest.fn()
}));

jest.unstable_mockModule('../scripts/item_loader.js', () => ({
  loadItems: jest.fn(async () => ({})),
  getItemData: jest.fn(() => ({ name: 'Maze Key 2', description: '' }))
}));

let addItem,
  getItemCount,
  inventory,
  serializeInventory,
  loadInventoryFromObject,
  onInteractEffect,
  createKaelorDialogue;

beforeEach(async () => {
  jest.resetModules();
  ({ addItem, getItemCount, inventory } = await import('../scripts/inventory.js'));
  ({ serializeInventory, loadInventoryFromObject } = await import('../scripts/inventory_state.js'));
  ({ onInteractEffect } = await import('../scripts/tile_type.js'));
  ({ createKaelorDialogue } = await import('../scripts/npc_dialogues/kaelor_the_weaver.js'));
  enterDoorMock.mockClear();
  inventory.length = 0;
});

test('door opens with key from loaded inventory and retains item when not consumed', async () => {
  addItem({ id: 'rusty_key', quantity: 1 });
  const saved = serializeInventory();
  inventory.length = 0;
  loadInventoryFromObject(saved);

  const door = {
    type: 'D',
    target: 'map',
    spawn: { x: 0, y: 0 },
    locked: true,
    requiresItem: 'rusty_key',
    consumeItem: false
  };

  await onInteractEffect(door, 0, 0, {}, null, 0);
  expect(enterDoorMock).toHaveBeenCalled();
  expect(getItemCount('rusty_key')).toBe(1);
});

test('door consumes key when flagged and item removed after load', async () => {
  addItem({ id: 'rusty_key', quantity: 1 });
  const saved = serializeInventory();
  inventory.length = 0;
  loadInventoryFromObject(saved);

  const door = {
    type: 'D',
    target: 'map',
    spawn: { x: 0, y: 0 },
    locked: true,
    requiresItem: 'rusty_key',
    consumeItem: true
  };

  await onInteractEffect(door, 0, 0, {}, null, 0);
  expect(enterDoorMock).toHaveBeenCalled();
  expect(getItemCount('rusty_key')).toBe(0);
});

test('map05 door to map07 uses maze_key_1 without consuming it', async () => {
  addItem({ id: 'maze_key_1', quantity: 1 });
  const saved = serializeInventory();
  inventory.length = 0;
  loadInventoryFromObject(saved);

  const map = JSON.parse(fs.readFileSync('./data/maps/map05.json', 'utf8'));
  const door = map.grid[5][0];

  await onInteractEffect(door, 0, 0, {}, null, 0);
  expect(enterDoorMock).toHaveBeenCalledWith('map07.json', { x: 10, y: 1 });
  expect(getItemCount('maze_key_1')).toBe(1);
});

test('npc trade detects items after load and deducts quantity', async () => {
  addItem({ id: 'prism_fragment', quantity: 12 });
  const saved = serializeInventory();
  inventory.length = 0;
  loadInventoryFromObject(saved);

  const dialogue = await createKaelorDialogue();
  const option = dialogue[0].options[0];
  const canTrade = option.condition({
    inventory: { prism_fragment: getItemCount('prism_fragment') },
    memory: new Set()
  });
  expect(canTrade).toBe(true);

  option.onChoose();
  expect(getItemCount('prism_fragment')).toBe(2);
  expect(getItemCount('maze_key_2')).toBe(1);
});
