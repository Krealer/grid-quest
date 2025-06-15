/** @jest-environment node */
import { logInfo, logWarn } from '../scripts/logger.js';

describe('logger', () => {
  let infoSpy, warnSpy;
  beforeEach(() => {
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    infoSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test('logInfo outputs JSON with level info', () => {
    logInfo('hello', { foo: 1 });
    expect(infoSpy).toHaveBeenCalledTimes(1);
    const entry = JSON.parse(infoSpy.mock.calls[0][0]);
    expect(entry.level).toBe('info');
    expect(entry.message).toBe('hello');
    expect(entry.foo).toBe(1);
    expect(entry.timestamp).toBeDefined();
  });

  test('logWarn outputs JSON with level warn', () => {
    logWarn('oops', { bar: 2 });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const entry = JSON.parse(warnSpy.mock.calls[0][0]);
    expect(entry.level).toBe('warn');
    expect(entry.message).toBe('oops');
    expect(entry.bar).toBe(2);
    expect(entry.timestamp).toBeDefined();
  });
});
