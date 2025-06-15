/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/error_prompt.js', () => ({
  showError: jest.fn()
}));

let loadJson, errorPrompt;
const originalFetch = global.fetch;

beforeEach(async () => {
  jest.resetModules();
  ({ loadJson } = await import('../scripts/data_service.js'));
  errorPrompt = await import('../scripts/error_prompt.js');
});

afterEach(() => {
  global.fetch = originalFetch;
  if (errorPrompt && errorPrompt.showError.mockClear) {
    errorPrompt.showError.mockClear();
  }
});

test('throws on network error', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('boom'));
  await expect(loadJson('path/file.json')).rejects.toThrow(
    'Network error while fetching path/file.json: boom'
  );
  expect(errorPrompt.showError).toHaveBeenCalled();
});

test('throws on 404 error', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(
      new Response('', { status: 404, statusText: 'Not Found' })
    );
  await expect(loadJson('missing.json')).rejects.toThrow(
    'File not found: missing.json'
  );
  expect(errorPrompt.showError).toHaveBeenCalled();
});

test('throws on other HTTP error', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(
      new Response('', { status: 500, statusText: 'Server Error' })
    );
  await expect(loadJson('server.json')).rejects.toThrow(
    '500 Server Error (server.json)'
  );
  expect(errorPrompt.showError).toHaveBeenCalled();
});

test('throws on malformed JSON', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response('oops', { status: 200 }));
  await expect(loadJson('bad.json')).rejects.toThrow(
    'Malformed JSON in bad.json'
  );
  expect(errorPrompt.showError).toHaveBeenCalled();
});

test('returns parsed JSON on success', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response('{"a":1}', { status: 200 }));
  await expect(loadJson('test.json')).resolves.toEqual({ a: 1 });
});

test('uses fallback on network error', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('fail'));
  await expect(loadJson('path/file.json', { ok: true })).resolves.toEqual({
    ok: true
  });
  expect(errorPrompt.showError).toHaveBeenCalled();
});

test('uses fallback on malformed JSON', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response('oops', { status: 200 }));
  await expect(loadJson('bad.json', [])).resolves.toEqual([]);
  expect(errorPrompt.showError).toHaveBeenCalled();
});

test('caches successful loads', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue(new Response('{"b":2}', { status: 200 }));
  await expect(loadJson('cache.json')).resolves.toEqual({ b: 2 });
  await expect(loadJson('cache.json')).resolves.toEqual({ b: 2 });
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
