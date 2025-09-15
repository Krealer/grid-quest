/** @jest-environment jsdom */
import { jest } from '@jest/globals';

let loadJson;
const originalFetch = global.fetch;

beforeEach(async () => {
  jest.resetModules();
  ({ loadJson } = await import('../scripts/dataService.js'));
});

afterEach(() => {
  global.fetch = originalFetch;
});

test('throws on network error', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('boom'));
  await expect(loadJson('path/file.json')).rejects.toThrow(
    'Network error while fetching path/file.json: boom'
  );
});

test('throws on 404 error', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response('', { status: 404, statusText: 'Not Found' }));
  await expect(loadJson('missing.json')).rejects.toThrow(
    'File not found: missing.json'
  );
});

test('throws on other HTTP error', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response('', { status: 500, statusText: 'Server Error' }));
  await expect(loadJson('server.json')).rejects.toThrow(
    '500 Server Error (server.json)'
  );
});

test('throws on malformed JSON', async () => {
  global.fetch = jest.fn().mockResolvedValue(new Response('oops', { status: 200 }));
  await expect(loadJson('bad.json')).rejects.toThrow('Malformed JSON in bad.json');
});

test('returns parsed JSON on success', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response('{"a":1}', { status: 200 }));
  await expect(loadJson('test.json')).resolves.toEqual({ a: 1 });
});
