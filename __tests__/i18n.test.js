/** @jest-environment jsdom */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/logger.js', () => ({
  logWarn: jest.fn()
}));

let t, setLanguage, logWarn;

beforeEach(async () => {
  jest.resetModules();
  localStorage.clear();
  ({ t, setLanguage } = await import('../scripts/i18n.js'));
  ({ logWarn } = await import('../scripts/logger.js'));
});

test('returns translated string with variables', () => {
  setLanguage('en');
  const res = t('status.remaining', { turns: 3 });
  expect(res).toBe('3 turn(s) remaining');
});

test('logs warning and returns placeholder when key missing', () => {
  setLanguage('en');
  const res = t('missing.key');
  expect(res).toBe('[Missing Translation]');
  expect(logWarn).toHaveBeenCalledWith('Translation Missing', { key: 'missing.key' });
});
