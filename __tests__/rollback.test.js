import { jest } from '@jest/globals';

const existsSync = jest.fn();
const copySync = jest.fn();
let logInfo, logWarn;

jest.unstable_mockModule('fs-extra', () => ({
  default: { existsSync, copySync },
  existsSync,
  copySync
}));

jest.unstable_mockModule('../scripts/logger.js', () => ({
  logInfo: jest.fn(),
  logWarn: jest.fn()
}));

let rollbackTo;

beforeEach(async () => {
  jest.resetModules();
  ({ rollbackTo } = await import('../scripts/rollback.js'));
  ({ logInfo, logWarn } = await import('../scripts/logger.js'));
  existsSync.mockReset();
  copySync.mockReset();
});

test('logs warning when executed in browser', async () => {
  global.window = {};
  ({ rollbackTo } = await import('../scripts/rollback.js'));
  await rollbackTo('v1');
  expect(logWarn).toHaveBeenCalledWith('Rollback is not supported in the browser.');
  delete global.window;
});

test('logs error when version missing', async () => {
  existsSync.mockReturnValue(false);
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  await rollbackTo('v1');
  expect(errorSpy).toHaveBeenCalledWith('Version v1 does not exist.');
  expect(copySync).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});

test('copies files and logs info when version exists', async () => {
  existsSync.mockReturnValue(true);
  await rollbackTo('v1');
  expect(copySync).toHaveBeenCalled();
  expect(logInfo).toHaveBeenCalledWith('Rolled back to version v1');
});
